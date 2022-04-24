# run requirements.txt


"""**DETECTION**"""
import torch
import re
import json
import fnmatch
import os
from fastDamerauLevenshtein import damerauLevenshtein
import tokenize
from .load_BARTpho import BARTpho
syllable_tokenizer, bartpho_syllable = BARTpho()


def is_special_token(token):
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


def is_number(token):
    if token.isnumeric():
        return True
    return bool(re.match('(\d+[\.,])+\d*', token))


def is_date(token):
    return bool(re.match('(\d+[-.\/])+\d+', token))


def process_abbreviation(token):
    token = token.lower()
    with open("app/modules/phrase_reduce.json", mode='r', encoding="utf-8") as file:
        phrase_reduce = json.load(file)
    if token in phrase_reduce.keys():
        return phrase_reduce[token]


def extract_phrases(text):
    text_split = text.split()
    list_number = []
    list_date = []
    list_special = []

    for i in range(len(text_split)):
        if is_number(text_split[i]):
            list_number.append(text_split[i])
            text_split[i] = "number"
        elif is_date(text_split[i]):
            list_date.append(text_split[i])
            text_split[i] = "date"
        elif is_special_token(text_split[i]):
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
                replace_abbreviation = process_abbreviation(tokens[i])
                if replace_abbreviation:
                    tokens[i] = replace_abbreviation
            process_phrase = " ".join(tokens)
            phrases_str.append(process_phrase)
            index_sent_dict[ind] = phrase
    text = " ".join(phrases_str)

    # if len(list_number) > 0:
    #   for number in list_number:
    #     text = text.replace("number", number, 1)
    # if len(list_date) > 0:
    #   for date in list_date:
    #     text = text.replace("date", date, 1)
    if len(list_special) > 0:
        for special1 in list_special:
            text = text.replace("special", special1, 1)
    # print("text:", text)
    # print("list_number:", list_number)
    # print("list_date:", list_date)
    # print("list_special:",list_special)
    # print("phrases_str:",phrases_str)
    # return text, list_number, list_date, list_special
    # print(phrases_str)
    # print(phrases_all)
    # print(index_sent_dict)
    return text, phrases_str, phrases_all, index_sent_dict, list_number, list_date


def detection(inputSentence):
    inputSentence = "<s> " + inputSentence + " </s>"
    token_split = inputSentence.split()
    tmp = token_split
    with open("app/modules/ngram.json", mode='r', encoding="utf-8") as file:
        data = json.load(file)
    for i in range(len(token_split)):
        tokenSplit = token_split[i].lower()
        if tokenSplit == "<s>" or tokenSplit == "</s>" or tokenSplit == "number" or tokenSplit == "date" or is_special_token(tokenSplit):
            continue

        elif tokenSplit not in data.keys():
            tmp[i] = "<mask1>"

        elif tokenSplit != "<s>" and tokenSplit != "</s>":
            pre_word = token_split[i - 1].lower()
            current_word = token_split[i].lower()
            next_word = token_split[i + 1].lower()

            if pre_word in data.keys() and current_word in data[pre_word].keys():
                if data[pre_word][current_word] > 1:
                    continue

            elif next_word in data[current_word].keys():
                if data[current_word][next_word] > 1:
                    continue

            else:
                if data[current_word]["sum"] < 15938:
                    tmp[i] = "<mask>"

    value = " ".join(tmp[1:-1])

    return value


"""**Input for correction**"""


def post_processing_detection(preprocessing, outputDetection):
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


def inputText(preSentence):
    outputDetection = detection(preSentence)
    final_output_detection = post_processing_detection(
        preSentence, outputDetection)
    return final_output_detection

# """**CORRECTION**"""


def check(value, init_value):
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
        candidate_2 = get_candidate_next_word(pre_word)

        word_search = init_words[index].lower()
        with open("app/modules/word_spell_tu_tao_final.json", mode='r', encoding="utf-8") as file_word_spell_final:
            word_spell_tu_tao_final = json.load(file_word_spell_final)

        candidate_1 = []
        if word_search in word_spell_tu_tao_final.keys():
            for token_word in word_spell_tu_tao_final[word_search]:
                candidate_1.append(token_word)

        candidate_1 = list(dict.fromkeys(candidate_1))
        if "<s>" in candidate_1:
            candidate_1.remove("<s>")
        if "</s>" in candidate_1:
            candidate_1.remove("</s>")
        candidate_2 = list(dict.fromkeys(candidate_2))
        if "<s>" in candidate_2:
            candidate_2.remove("<s>")
        if "</s>" in candidate_2:
            candidate_2.remove("</s>")
        candidate_3 = fill_mask(" ".join(init_words[1:-1]), index - 1)
        candidate_3 = list(map(str.lower, candidate_2))
        if "<s>" in candidate_3:
            candidate_3.remove("<s>")
        if "</s>" in candidate_3:
            candidate_3.remove("</s>")

        final_candidate = []

        for next_word in candidate_2:
            if next_word in candidate_1 and next_word in candidate_3:
                final_candidate.append(next_word)

        if len(final_candidate) == 0:
            if len(candidate_2) > 485:
                for next_word in candidate_2[0:485]:
                    if next_word in candidate_1:
                        final_candidate.append(next_word)
            else:
                for next_word in candidate_2:
                    if next_word in candidate_1:
                        final_candidate.append(next_word)

        dict_minimumEditDistance_case = minimumEditDistance(
            init_words[index].lower(), final_candidate)

        if dict_minimumEditDistance_case == None:
            if words[index] == "<mask1>":
                dict_minimumEditDistance_case1 = minimumEditDistance(
                    init_words[index].lower(), candidate_2)
                if dict_minimumEditDistance_case1 != None:
                    wordReplae = min(dict_minimumEditDistance_case1,
                                     key=dict_minimumEditDistance_case1.get)
                    if wordReplae != init_words[index].lower():
                        words[index] = wordReplae
                        update_final_candidate = []
                        update_final_candidate.append(init_words[index])
                        update_final_candidate.extend(
                            dict_minimumEditDistance_case1)
                        list_replace.append(
                            min(update_final_candidate, update_final_candidate[0:10]))
                else:
                    dict_minimumEditDistance_case1 = minimumEditDistance(
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
                update_final_candidate.extend(dict_minimumEditDistance_case)
                list_replace.append(
                    min(update_final_candidate, update_final_candidate[0:10]))

        sentence = " ".join(words)
    return sentence, list_replace


def fill_mask(detection_input, index_case_1):
    detection_input = detection_input.lower()
    TXT_tmp = detection_input.split()
    TXT_tmp[index_case_1] = "<mask>"
    TXT_tmp = " ".join(TXT_tmp)
    input_ids = syllable_tokenizer(
        TXT_tmp.lower(), return_tensors='pt')['input_ids']
    logits = bartpho_syllable(input_ids).logits
    masked_position = (
        input_ids[0] == syllable_tokenizer.mask_token_id).nonzero().item()
    probs = logits[0, masked_position].softmax(dim=0)
    values, predictions = probs.topk(2500)
    candidate = syllable_tokenizer.decode(predictions).split()
    candidate_new = []
    for word in candidate:
        candidate_new.append(re.sub(r'[^\w\s]', '', word))
    return candidate_new


def get_candidate_next_word(word):
    input_file = open("app/modules/ngram_xac_suat.json",
                      mode="r", encoding="utf-8")
    data = json.load(input_file)
    list_candidate = []
    if word in data.keys():
        keys = data[word].keys()
        for key in keys:
            if key != "sum":
                list_candidate.append(key)
    return list_candidate


def minimumEditDistance(word, candidate):
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


def compareCorrection(outputDetection):
    value = outputDetection[1]
    init_value = outputDetection[0]

    value = "<s> " + value + " </s>"
    value = re.sub(r"\s+", r" ", value).strip()

    init_value = "<s> " + init_value + " </s>"
    init_value = re.sub(r"\s+", r" ", init_value).strip()

    TXT, listReplace = check(value, init_value)
    TXT = TXT.split(" ")

    TXT = " ".join(TXT[1:-1])
    return TXT, listReplace


def decode_phrases(phrases_str, correct_sentence, phrases_all, index_sent_dict, list_number, list_date):
    # correct_phrases = ['lê văn', 'Hoàng', 'Hehe', 'g']
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


def getResult(text):
    preprocess_inputSentence, phrases_str, phrases_all, index_sent_dict, list_number, list_date = extract_phrases(
        text)
    outputDetection = inputText(preprocess_inputSentence)
    outputCorrection, listReplace = compareCorrection(outputDetection)
    sentence_1 = preprocess_inputSentence.split(" ")
    sentence_2 = outputCorrection.split(" ")
    tmp = sentence_1
    for i in range(len(sentence_1)):
        if sentence_2[i] != sentence_1[i]:
            tmp[i] = "<mask>"
    resultCorrection = " ".join(tmp)
    resultDetection = decode_phrases(
        phrases_str, resultCorrection, phrases_all, index_sent_dict, list_number, list_date)
    return resultDetection, listReplace

# inputSentence = "bn bị bệnh 3 ngày nay từ ngày 20/11 tiêu lõng, ho, sỗ mũi đau miệng khiong ăn uống được mệt, vả mồ hôi, Nhập viện"
