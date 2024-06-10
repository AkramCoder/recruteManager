# import spacy
# import docx2txt
# import PyPDF2

# pdf_file_path = './cv1.pdf'

# def get_text_pdf(path):
#     pdf_file = open(path, 'rb')
#     pdf_reader = PyPDF2.PdfReader(pdf_file)
#     text = ''

#     for page_num in range(len(pdf_reader.pages)):
#         page = pdf_reader.pages[page_num]
#         text += page.extract_text()

#     pdf_file.close()

#     return text

# def get_text_word(path):
#     return docx2txt.process(path)

import pickle
import spacy
import time
import re
# from names_dataset import NameDataset
# nd = NameDataset()

def find_indices_of_starting_0(text):
    # Regular expression pattern to match '0' at the beginning of words
    pattern = r'\b0'

    # Find all matches in the text
    matches = re.finditer(pattern, text)

    # Get the indices of the matches
    indices = [match.start() for match in matches]

    return indices

def find_phone(text, indice):
    i = indice
    result = '0'
    while len(result) < 10:
        while text[i+1] in (' ', '/', '-', '.'):
            i += 1
        try:
            int(text[i+1])
            result = result + text[i+1]
            i += 1
        except:
            return
    
    return result

def find_email(text):
    email_pattern = r'@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}'

    email_domains = re.findall(email_pattern, text)
    emails = []
    for domain in email_domains:
        index = text.index(domain)
        words_before = text[:index].split()
        username = words_before[-1]
        result = username+domain
        emails.append(result)

    return emails
    

nlp = spacy.load('C:\\Users\\XPS\\Downloads\\lapem_manager_app-main-master (1)\\lapem_manager_app-main-master\\backend_\\user\\modelV3')

def get_data_type(text):
    try: 
        
        text = " ".join(text.split())
        text = text.replace('\n', " ")
        
        indices = find_indices_of_starting_0(text)

        phone_numbers = []
        for indice in indices:
            r = find_phone(text, indice)
            if r:
                phone_numbers.append(r)

        email = find_email(text)

        doc = nlp(text)
        result = []
        is_phone = False
        is_email = False
        
            
        for ent in doc.ents:
            data = {
                "text": ent.text,
                "start": ent.start_char,
                "end": ent.end_char,
                "label": ent.label_
            }
            if((ent.text[:2] in ['05','06', '07'] and len(ent.text) == 10) or ent.label_ == 'PhoneNumber'):
                is_phone = True

            if(ent.label_ == 'Email'):
                is_email = True
            result.append(data)

        if(not is_phone):
            for phone in phone_numbers:
                data = {
                    "text": phone,
                    "start": None,
                    "end": None,
                    "label": 'PhoneNumber'
                }
                result.append(data)

        if(not is_email and len(email)>0):
            data = {
                "text": email[0],
                "start": None,
                "end": None,
                "label": 'Email'
            }
            result.append(data)
        

        return result
    except Exception as e:
        print("Error:", str(e))
        return []