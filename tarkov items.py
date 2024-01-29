# -*- coding: utf-8 -*-
"""
Created on Sun Jan 28 17:07:28 2024

@author: eric
"""
import os
import json
import shutil

def load_json(file_path):
    item_file = open(file_path, 'r', encoding='utf8')
    item_data = json.loads(item_file.read())
    item_file.close()
    return item_data

install_drive = 'C:/'
eft_version = 'EFT 3.8/'

item_path = install_drive + eft_version + 'Aki_Data/Server/database/templates/items.json'

item_data = load_json(item_path)

new_item_dict = {}

x = 1
for key in item_data.keys():
    try:
        new_item_dict[str(x)] = {
        'name' : item_data[key]['_props']['Name'],
        #'localeName' : item_data[key]['locale']['Name'],
        'shortName' : item_data[key]['_props']['ShortName'],
        #'localeshortName' : item_data[key]['locale']['ShortName'],
        'image' : item_data[key]['_props']['Prefab']['path']}
        x += 1
    except:
        pass

test_folder = 'C:/Users/eric/Desktop/test/'
test_image_list = os.listdir(test_folder)

image_folder =' C:/Users/eric/tarkov-shopper/public/images/'
image_list = os.listdir(image_folder)

os.renames(test_folder+test_image_list[1], test_folder+test_image_list[1].lower())

for image in range(len(image_list)):
    image_list[image] = image_list[image].lower()