from transformers import AutoModel, AutoTokenizer
from transformers import MBartForConditionalGeneration
# BARTpho-syllable


def BARTpho():
    syllable_tokenizer = AutoTokenizer.from_pretrained(
        "vinai/bartpho-syllable", use_fast=True)
    bartpho_syllable = MBartForConditionalGeneration.from_pretrained(
        "vinai/bartpho-syllable")
    return syllable_tokenizer, bartpho_syllable
