from transformers import AutoModel, AutoTokenizer
from transformers import MBartForConditionalGeneration
import torch
# BARTpho-syllable


def BARTpho():
    syllable_tokenizer = torch.load("app/modules/syllable_tokenizer.pth")
    bartpho_syllable = torch.load("app/modules/bartpho_syllable.pth")
    bartpho_syllable.eval()
    return syllable_tokenizer, bartpho_syllable
