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


def extract_phrases(text):
    text_split = text.split()
    list_number = []
    list_date = []
    list_special_1 = []
    list_special_2 = []

    for i in range(len(text_split)):
        if is_number(text_split[i]):
            list_number.append(text_split[i])
            text_split[i] = "number"
        elif is_date(text_split[i]):
            list_date.append(text_split[i])
            text_split[i] = "date"
        elif is_special_token_1(text_split[i]):
            list_special_1.append(text_split[i])
            text_split[i] = "special1"
        elif is_special_token_2(text_split[i]):
            list_special_2.append(text_split[i])
            text_split[i] = "special2"

    text = " ".join(text_split)

    pattern = r'\w[\w ]*|\s\W+|\W+'

    phrases_all = re.findall(pattern, text)

    phrases_str = []
    for phrase in phrases_all:
        if not re.match(r'[!"#$%&''()*+,-./:;<=>?@[\]^_`{|}~]', phrase.strip()):
            phrases_str.append(phrase.strip())
    text = " ".join(phrases_str)

    if len(list_number) > 0:
        for number in list_number:
            text = text.replace("number", number, 1)
    if len(list_date) > 0:
        for date in list_date:
            text = text.replace("date", date, 1)
    if len(list_special_1) > 0:
        for special1 in list_special_1:
            text = text.replace("special1", special1, 1)
    if len(list_special_2) > 0:
        for special2 in list_special_2:
            text = text.replace("special2", special2, 1)

    return text


def detection(inputSentence):
    inputSentence = inputSentence.lower()
    inputSentence = "<s> " + inputSentence + " </s>"
    token_split = inputSentence.split()
    tmp = token_split
    with open("app/modules/ngram.json", mode='r', encoding="utf-8") as file:
        data = json.load(file)
    for i in range(len(token_split)):
        if token_split[i] == "<s>" or token_split[i] == "</s>":
            continue

        elif (is_number(token_split[i]) or is_special_token_1(token_split[i]) or is_special_token_2(token_split[i]) or is_date(token_split[i])):
            continue

        elif process_abbreviation(token_split[i]):
            tmp[i] = process_abbreviation(token_split[i])

        elif token_split[i].lower() not in data.keys():
            tmp[i] = "<mask1>"

        elif token_split[i] != "<s>" and token_split[i] != "</s>":
            pre_word = token_split[i - 1]
            current_word = token_split[i]
            next_word = token_split[i + 1]

            if is_number(pre_word):
                pre_word = "number"
            elif is_special_token_1(pre_word) or is_special_token_2(pre_word):
                pre_word = "special"
            elif is_date(pre_word):
                pre_word = "date"

            if is_number(next_word):
                next_word = "number"
            elif is_special_token_1(next_word) or is_special_token_2(next_word):
                next_word = "special"
            elif is_date(next_word):
                next_word = "date"

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


def is_special_token_1(token):
    return bool(re.match(
        '([a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+[\+\*\^\@\#\.\&\/-])+[a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+',
        token))


def is_special_token_2(token):
    return bool(re.match(
        r'([0-9]+)+ml|([0-9]+)+ure|([0-9]+)+mg',
        token))  # example: "700ml", "3ure", "81mg"


def is_number(token):
    if token.isnumeric():
        return True
    return bool(re.match('(\d+[\.,])+\d', token))


def is_date(token):
    return bool(re.match('(\d+[-.\/])+\d+', token))


def process_abbreviation(token):
    token = token.lower()
    with open("app/modules/phrase_reduce.json", mode='r', encoding="utf-8") as file:
        phrase_reduce = json.load(file)
    if token in phrase_reduce.keys():
        return phrase_reduce[token]


"""**Input for correction**"""


def post_processing_detection(preprocessing, outputDetection):
    split_word = preprocessing.split()
    for i in range(len(split_word)):
        if process_abbreviation(split_word[i]):
            split_word[i] = process_abbreviation(split_word[i])

    detection_input = " ".join(split_word)

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


def inputText(sentence):
    preprocessing = extract_phrases(sentence)  # bỏ dấu của câu
    # print("preprocessing:", preprocessing)
    outputDetection = detection(preprocessing)
    final_output_detection = post_processing_detection(
        preprocessing, outputDetection)
    # print("outputDetection:", final_output_detection[1])
    return final_output_detection


"""**CORRECTION**"""


def check(value, init_value):
    list_replace = []
    sentence = value
    words = sentence.split(" ")
    init_sentence = init_value
    init_words = init_value.split(" ")
    list_index = []
    for i in range(len(words)):
        if words[i] == "<mask1>" or words[i] == "<mask>":
            list_index.append(i)
    for index in list_index:
        words = sentence.split(" ")
        pre_word = init_words[index - 1]
        candidate_2 = get_candidate(pre_word)

        word_search = init_words[index]
        with open("app/modules/word_spell_tu_tao_final.json", mode='r', encoding="utf-8") as file_word_spell_final:
            word_spell_tu_tao_final = json.load(file_word_spell_final)

        candidate_1 = []
        if word_search in word_spell_tu_tao_final.keys():
            for token_word in word_spell_tu_tao_final[word_search]:
                candidate_1.append(token_word)
            candidate_1.append(word_search)

        candidate_1 = list(dict.fromkeys(candidate_1))
        candidate_2 = list(dict.fromkeys(candidate_2))
        candidate_3 = fill_mask(" ".join(init_words[1:-1]), index - 1)
        candidate_3 = list(map(str.lower, candidate_2))

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

        if len(final_candidate) == 0:
            if words[index] == "<mask1>":
                # print(word_search,":", candidate_2[0:10])
                wordReplae = minimumEditDistance(
                    init_words[index], candidate_2)
                # print("wordReplae:", wordReplae)
                # print("___________________________________________________________")
                if wordReplae != "<s>" and wordReplae != "</s>" and wordReplae != "":
                    words[index] = wordReplae
                    update_final_candidate = []
                    update_final_candidate.append(wordReplae)
                    update_final_candidate.extend(candidate_2[0:10])
                    list_replace.append(update_final_candidate)
                else:
                    # print(word_search,":", candidate_3[0:10])
                    wordReplae = minimumEditDistance(
                        init_words[index], candidate_3)
                    list_replace.append(candidate_3[0:10])
                    update_final_candidate = []
                    update_final_candidate.append(wordReplae)
                    update_final_candidate.extend(candidate_2[0:10])
                    list_replace.append(update_final_candidate)
                    # print("wordReplae:", wordReplae)
                    # print("___________________________________________________________")
            elif words[index] == "<mask>":
                # print(word_search,":", final_candidate)
                words[index] = init_words[index]
                update_final_candidate = []
                update_final_candidate.append(init_words[index])
                update_final_candidate.extend(final_candidate)
                list_replace.append(update_final_candidate)
                # print("wordReplae:", init_words[index])
                # print("___________________________________________________________")

        elif len(final_candidate) > 0:
            # print(word_search,":", final_candidate)
            wordReplae = minimumEditDistance(
                init_words[index], final_candidate)
            # list_replace.append(final_candidate)
            # print("wordReplae:", wordReplae)
            # print("___________________________________________________________")
            if wordReplae != "<s>" and wordReplae != "</s>" and wordReplae != "":
                words[index] = wordReplae
                list_replace.append(final_candidate)
            else:
                words[index] = init_words[index]
                update_final_candidate = []
                update_final_candidate.append(init_words[index])
                update_final_candidate.extend(final_candidate)
                list_replace.append(update_final_candidate)

        sentence = " ".join(words)
    return sentence, list_replace


def fill_mask(detection_input, index_case_1):
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


def get_candidate(word):
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
    dict = {}
    for word_2 in candidate:
        tmp = damerauLevenshtein(
            word_1.lower(), word_2.lower(), similarity=False)
        if tmp < 4:
            dict[word_2] = tmp
    if len(dict) > 0:
        return min(dict, key=dict.get)
    else:
        return ""


def tien_xu_ly(sentence):
    words = sentence.split(" ")
    for i in range(len(words)):
        word = words[i]
        if process_abbreviation(word):
            words[i] = process_abbreviation(word)
        elif is_number(word):
            words[i] = "number"
        elif is_date(word):
            words[i] = "date"
        elif is_special_token_1(word) or is_special_token_2(word):
            words[i] = "special"

    final_words = " ".join(words)
    return final_words.lower()


def compareCorrection(outputDetection):
    value = outputDetection[1]
    init_value = outputDetection[0]

    value = value.lower()
    value = tien_xu_ly(value)
    value = "<s> " + value + " </s>"
    value = re.sub(r"\s+", r" ", value).strip()

    init_value = init_value.lower()
    init_value = tien_xu_ly(init_value)
    init_value = "<s> " + init_value + " </s>"
    init_value = re.sub(r"\s+", r" ", init_value).strip()

    TXT, listReplace = check(value, init_value)
    TXT = TXT.split(" ")

    TXT = " ".join(TXT[1:-1])
    return TXT, listReplace


def getResult(text):
    outputDetection = inputText(text)
    outputCorrection, resultCorrection = compareCorrection(outputDetection)
    return outputDetection[1], resultCorrection
