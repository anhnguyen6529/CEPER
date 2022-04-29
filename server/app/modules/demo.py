"""**DETECTION**"""
import time
import torch
import re
import ujson
import fnmatch
import os
from fastDamerauLevenshtein import damerauLevenshtein
import tokenize
from .load_BARTpho import BARTpho


class AutoCorrection:
    def __init__(self):
        start_time = time.time()
        self.syllable_tokenizer, self.bartpho_syllable = BARTpho()
        print("timeloadBARTpho:", time.time() - start_time)
        with open("app/modules/phrase_reduce.json", mode='r', encoding="utf-8") as file:
            self.phrase_reduce = ujson.load(file)
        with open("app/modules/ngram.json", mode='r', encoding="utf-8") as file:
            self.data = ujson.load(file)
        with open("app/modules/word_spell_tu_tao_final.json", mode='r', encoding="utf-8") as file_word_spell_final:
            self.word_spell_tu_tao_final = ujson.load(file_word_spell_final)
        input_file = open("app/modules/ngram_xac_suat.json",
                          mode="r", encoding="utf-8")
        self.ngram_xacsuat = ujson.load(input_file)
        input_file = open("app/modules/trigram.json",
                          mode="r", encoding="utf-8")
        self.data_trigram = ujson.load(input_file)
        input_file = open("app/modules/pre_ngram.json",
                          mode="r", encoding="utf-8")
        self.data_pre_ngram = ujson.load(input_file)

    def is_special_token(self, token):
        if bool(re.match(
            '([a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+[\’\'\+\*\^\@\#\.\&\/-])+[a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+',
                token)):
            return True
        elif bool(re.match(
            r'([0-9]+)+ml|([0-9]+)+ure|([0-9]+)+mg',
                token)):  # example: "700ml", "3ure", "81mg"
            return True
        else:
            return False

    def is_number(self, token):
        if token.isnumeric():
            return True
        return bool(re.match('(\d+[\.,])+\d*', token))

    def is_date(self, token):
        return bool(re.match('(\d+[-.\/])+\d+', token))

    def process_abbreviation(self, token):
        token = token.lower()
        phrase_reduce = self.phrase_reduce
        if token in phrase_reduce.keys():
            return phrase_reduce[token]

    def extract_phrases(self, text):
        text_split = text.split()
        list_number = []
        list_date = []
        list_special = []

        for i in range(len(text_split)):
            if self.is_number(text_split[i]):
                list_number.append(text_split[i])
                text_split[i] = "number"
            elif self.is_date(text_split[i]):
                list_date.append(text_split[i])
                text_split[i] = "date"
            elif self.is_special_token(text_split[i]):
                list_special.append(text_split[i])
                text_split[i] = "special"

        text = " ".join(text_split)

        pattern = r'\w[\w ]*|\s\W+|\W+'

        phrases_all = re.findall(pattern, text)

        index_sent_dict = {}
        phrases_str = []
        for ind, phrase in enumerate(phrases_all):
            if not re.match(r'[!"#$%&''()*+,-./:;<=>?@[\]^_`{|}~]', phrase.strip()):
                tokens = phrase.strip().split(" ")
                for i in range(len(tokens)):
                    replace_abbreviation = self.process_abbreviation(tokens[i])
                    if replace_abbreviation:
                        tokens[i] = replace_abbreviation
                process_phrase = " ".join(tokens)
                phrases_str.append(process_phrase)
                index_sent_dict[ind] = phrase
        text = " ".join(phrases_str)

        if len(list_special) > 0:
            for special1 in list_special:
                text = text.replace("special", special1, 1)

        return text, phrases_str, phrases_all, index_sent_dict, list_number, list_date

    def detection(self, inputSentence):
        inputSentence = "<s> " + inputSentence + " </s>"
        token_split = inputSentence.split()
        tmp = token_split
        data = self.data
        for i in range(len(token_split)):
            tokenSplit = token_split[i].lower()
            if tokenSplit == "<s>" or tokenSplit == "</s>" or tokenSplit == "number" or tokenSplit == "date" or self.is_special_token(tokenSplit) or self.process_abbreviation(tokenSplit):
                continue

            elif tokenSplit not in data.keys():
                tmp[i] = "<mask1>"

            elif tokenSplit != "<s>" and tokenSplit != "</s>":
                pre_word = token_split[i - 1].lower()
                current_word = token_split[i].lower()
                next_word = token_split[i + 1].lower()

                if pre_word in data.keys() and current_word in data[pre_word].keys() and data[pre_word][current_word] > 1:
                    continue

                elif next_word in data[current_word].keys() and data[current_word][next_word] > 1:
                    continue

                else:
                    if data[current_word]["sum"] < 5305:  # 1%
                        tmp[i] = "<mask>"

        value = " ".join(tmp[1:-1])

        return value

    """**Input for correction**"""

    def post_processing_detection(self, preprocessing, outputDetection):
        detection_input = preprocessing

        split_word_input_detection = detection_input.split()
        split_outputDetection_postprocessing = outputDetection.split()
        list_2_mask = []
        for index, pair in enumerate(zip(split_outputDetection_postprocessing, split_outputDetection_postprocessing[1:])):
            if (pair[0] == "<mask1>" and pair[0] == pair[1]):
                list_2_mask.append(index)

        if len(list_2_mask) > 0:
            for i in list_2_mask:
                split_word_input_detection[i] = split_word_input_detection[i] + \
                    split_word_input_detection[i + 1]
                split_word_input_detection[i + 1] = ""
                split_outputDetection_postprocessing[i + 1] = ""

        detection_input_postprocessing = " ".join(split_word_input_detection)
        detection_input_postprocessing = re.sub(
            r"\s+", r" ", detection_input_postprocessing).strip()

        outputDetection_postprocessing = " ".join(
            split_outputDetection_postprocessing)
        outputDetection_postprocessing = re.sub(
            r"\s+", r" ", outputDetection_postprocessing).strip()

        return [detection_input_postprocessing, outputDetection_postprocessing]

    def inputText(self, preSentence):
        outputDetection = self.detection(preSentence)
        final_output_detection = self.post_processing_detection(
            preSentence, outputDetection)
        return final_output_detection

    # """**CORRECTION**"""

    def check(self, value, init_value):
        list_replace = []
        sentence = value
        words = sentence.split(" ")
        init_sentence = init_value
        init_words = init_value.split(" ")
        list_index = []
        for i in range(len(words)):
            word = words[i].lower()
            if word == "<mask1>" or word == "<mask>":
                list_index.append(i)
        for index in list_index:
            words = sentence.split(" ")
            pre_word = init_words[index - 1].lower()
            current_word = init_words[index].lower()
            next_word = init_words[index + 1].lower()

            word_spell_tu_tao_final = self.word_spell_tu_tao_final

            candidate_1 = []
            if current_word in word_spell_tu_tao_final.keys():
                for token_word in word_spell_tu_tao_final[current_word]:
                    candidate_1.append(token_word)

            candidate_1 = self.clean(candidate_1)
            candidate_3 = self.fill_mask(" ".join(init_words[1:-1]), index - 1)
            candidate_3 = self.clean(candidate_3)

            final_candidate = []
            candidate_trigram = self.clean(
                self.get_candidate_trigram(pre_word, next_word))
            if len(candidate_1) > 0:
                if len(candidate_trigram) > 0:
                    candidate_2 = candidate_trigram
                    for middle_word_propose in candidate_2:
                        if middle_word_propose in candidate_1 and middle_word_propose in candidate_3:
                            final_candidate.append(middle_word_propose)

                    if len(final_candidate) == 0:
                        for middle_word_propose in candidate_2:
                            if middle_word_propose in candidate_1:
                                final_candidate.append(middle_word_propose)

                if len(candidate_trigram) == 0 or len(final_candidate) == 0:
                    candidate_next_word = self.clean(
                        self.get_candidate_next_word(pre_word))
                    candidate_2 = candidate_next_word
                    if len(candidate_2) > 0:
                        for next_word_propose in candidate_2:
                            if next_word_propose in candidate_1 and next_word_propose in candidate_3:
                                final_candidate.append(next_word_propose)

                        if len(final_candidate) == 0:
                            for next_word_propose in candidate_2:
                                if next_word_propose in candidate_1:
                                    final_candidate.append(next_word_propose)

                    if len(candidate_2) == 0 or len(final_candidate) == 0:
                        candidate_pre_word = self.clean(
                            self.get_candidate_pre_word(next_word))
                        candidate_2 = candidate_pre_word
                        if len(candidate_2) > 0:
                            for pre_word_propose in candidate_2:
                                if pre_word_propose in candidate_1 and pre_word_propose in candidate_3:
                                    final_candidate.append(pre_word_propose)

                        if len(final_candidate) == 0:
                            for pre_word_propose in candidate_2:
                                if pre_word_propose in candidate_1:
                                    final_candidate.append(pre_word_propose)

            if len(final_candidate) == 0:
                dict_minimumEditDistance_case = None
            else:
                dict_minimumEditDistance_case = self.minimumEditDistance(
                    init_words[index].lower(), final_candidate)

            if dict_minimumEditDistance_case == None:
                if words[index] == "<mask1>":
                    flag = 0
                    for candidate_2 in [candidate_trigram, candidate_next_word, candidate_pre_word]:
                        if len(candidate_2) == 0:
                            dict_minimumEditDistance_case1 = None
                        else:
                            dict_minimumEditDistance_case1 = self.minimumEditDistance(
                                init_words[index].lower(), candidate_2)

                        if dict_minimumEditDistance_case1 != None:
                            wordReplae = min(
                                dict_minimumEditDistance_case1, key=dict_minimumEditDistance_case1.get)
                            flag = 1
                            if wordReplae != init_words[index].lower():
                                words[index] = wordReplae
                                update_final_candidate = []
                                update_final_candidate.append(
                                    init_words[index])
                                update_final_candidate.extend(
                                    dict_minimumEditDistance_case1)
                                list_replace.append(
                                    min(update_final_candidate, update_final_candidate[0:10]))
                            break
                    if flag == 0:
                        dict_minimumEditDistance_case1 = self.minimumEditDistance(
                            init_words[index].lower(), candidate_3)
                        if dict_minimumEditDistance_case1 != None:
                            wordReplae = min(
                                dict_minimumEditDistance_case1, key=dict_minimumEditDistance_case1.get)
                            if wordReplae != init_words[index].lower():
                                update_final_candidate = []
                                update_final_candidate.append(wordReplae)
                                update_final_candidate.extend(
                                    dict_minimumEditDistance_case1)
                                list_replace.append(
                                    min(update_final_candidate, update_final_candidate[0:10]))
                        else:
                            words[index] = init_words[index]

                elif words[index] == "<mask>":
                    words[index] = init_words[index]

            elif dict_minimumEditDistance_case != None:
                wordReplae = min(dict_minimumEditDistance_case,
                                 key=dict_minimumEditDistance_case.get)
                words[index] = wordReplae
                if wordReplae != init_words[index].lower():
                    update_final_candidate = []
                    update_final_candidate.append(init_words[index])
                    update_final_candidate.extend(
                        dict_minimumEditDistance_case)
                    list_replace.append(
                        min(update_final_candidate, update_final_candidate[0:10]))

            sentence = " ".join(words)
        return sentence, list_replace

    def clean(self, candidate):
        candidate = list(dict.fromkeys(candidate))
        if "<s>" in candidate:
            candidate.remove("<s>")
        if "</s>" in candidate:
            candidate.remove("</s>")
        if " " in candidate:
            candidate.remove(" ")
        return candidate

    def fill_mask(self, detection_input, index_case_1):
        detection_input = detection_input.lower()
        TXT_tmp = detection_input.split()
        TXT_tmp[index_case_1] = "<mask>"
        TXT_tmp = " ".join(TXT_tmp)
        input_ids = self.syllable_tokenizer(
            TXT_tmp.lower(), return_tensors='pt')['input_ids']
        logits = self.bartpho_syllable(input_ids).logits
        masked_position = (
            input_ids[0] == self.syllable_tokenizer.mask_token_id).nonzero().item()
        probs = logits[0, masked_position].softmax(dim=0)
        values, predictions = probs.topk(2000)  # vocab_size = 40030
        candidate = self.syllable_tokenizer.decode(predictions).split()
        candidate_new = []
        for word in candidate:
            candidate_new.append(re.sub(r'[^\w\s]', '', word))
        return candidate_new

    def get_candidate_next_word(self, word):
        data = self.ngram_xacsuat
        list_candidate = []
        if word in data.keys():
            keys = data[word].keys()
            for key in keys:
                if key != "sum" and data[word][key] > 1:
                    list_candidate.append(key)
        return list_candidate

    def get_candidate_trigram(self, preWord, nextWord):
        data = self.data_trigram
        list_candidate = []
        if preWord in data.keys():
            keys = data[preWord].keys()
            for key in keys:
                token_key = key.split(" ")
                if key != "sum" and data[preWord][key] > 1 and token_key[-1] == nextWord:
                    list_candidate.append(token_key[0])
        return list_candidate

    def get_candidate_pre_word(self, currentWord):
        data = self.data_pre_ngram
        list_candidate = []
        if currentWord in data.keys():
            keys = data[currentWord].keys()
            for key in keys:
                if key != "sum" and data[currentWord][key] > 1:
                    list_candidate.append(key)
        return list_candidate

    def minimumEditDistance(self, word, candidate):
        word_1 = word
        dict_candidate = {}
        for word_2 in candidate:
            tmp = damerauLevenshtein(
                word_1.lower(), word_2.lower(), similarity=False)
            if tmp < 4:
                dict_candidate[word_2] = tmp
        if len(dict_candidate) > 0:
            # return min(dict, key = dict.get)
            return dict(sorted(dict_candidate.items(), key=lambda item: item[1], reverse=True))
        else:
            return None

    def compareCorrection(self, outputDetection):
        value = outputDetection[1]
        init_value = outputDetection[0]

        value = "<s> " + value + " </s>"
        value = re.sub(r"\s+", r" ", value).strip()

        init_value = "<s> " + init_value + " </s>"
        init_value = re.sub(r"\s+", r" ", init_value).strip()

        TXT, listReplace = self.check(value, init_value)
        TXT = TXT.split(" ")

        TXT = " ".join(TXT[1:-1])
        return TXT, listReplace

    def decode_phrases(self, phrases_str, correct_sentence, phrases_all, index_sent_dict, list_number, list_date):
        correct_phrases = []
        index_correct_token = 0
        tokens_correct = correct_sentence.split(" ")
        for phrase_str in phrases_str:
            length_phrase = len(phrase_str.split(" "))
            correct_phrases.append(" ".join(
                tokens_correct[index_correct_token:index_correct_token + length_phrase]))
            index_correct_token += length_phrase
        sentence_correct = phrases_all.copy()
        for i, idx_sent in enumerate(index_sent_dict.keys()):
            sentence_correct[idx_sent] = correct_phrases[i]

        final_sentence = ""
        for i in range(len(sentence_correct)):
            pharse_sentence = sentence_correct[i]
            if pharse_sentence in ["(", '/"', "/'"]:
                final_sentence += " " + pharse_sentence
            else:
                final_sentence += pharse_sentence

        if len(list_number) > 0:
            for number in list_number:
                final_sentence = final_sentence.replace("number", number, 1)
        if len(list_date) > 0:
            for date in list_date:
                final_sentence = final_sentence.replace("date", date, 1)
        return final_sentence

    def getResult(self, text):
        preprocess_inputSentence, phrases_str, phrases_all, index_sent_dict, list_number, list_date = self.extract_phrases(
            text)
        outputDetection = self.inputText(preprocess_inputSentence)
        outputCorrection, listReplace = self.compareCorrection(outputDetection)
        sentence_1 = outputDetection[0].split(" ")
        sentence_2 = outputCorrection.split(" ")
        tmp = sentence_1
        for i in range(len(sentence_1)):
            if sentence_2[i] != sentence_1[i]:
                tmp[i] = "<mask>"
        resultCorrection = " ".join(tmp)
        resultDetection = self.decode_phrases(
            phrases_str, resultCorrection, phrases_all, index_sent_dict, list_number, list_date)
        return resultDetection, listReplace


# inputSentence = "bn bị bệnh 3 ngày nay từ ngày 20/11 tiêu lõng, ho, sỗ mũi đau miệng khiong ăn uống được mệt, vả mồ hôi  23 lần/phút, Nhập viện"
