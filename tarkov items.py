# -*- coding: utf-8 -*-
"""
Created on Sun Jan 28 17:07:28 2024

@author: eric

Script used to clean and prep Tarkov item data then pair with thumbnail images
for the Tarkov-Shopper app
"""
import os
import json
import shutil
from difflib import SequenceMatcher
import jellyfish
from thefuzz import fuzz

def load_json(file_path):
    item_file = open(file_path, 'r', encoding='utf8')
    item_data = json.loads(item_file.read())
    item_file.close()
    return item_data

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

def build_match_list(item_name, image_name):
    jaro_match = jellyfish.jaro_winkler_similarity(item_name, image_name)
    similar_match = similar(item_name, image_name)
    fuzz_ratio_match = fuzz.ratio(item_name, image_name)
    fuzz_partial_match = fuzz.partial_ratio(item_name, image_name)
    
    results = {
        'jaro': [item_name, image_name, jaro_match * 100],
        'simi': [item_name, image_name, similar_match * 100],
        'fuzz': [item_name, image_name, fuzz_ratio_match],
        'fuzz-partial': [item_name, image_name, fuzz_partial_match]    
    }
    
    best_match = max(results, key=lambda key:results[key][2])
    best_result = results[best_match]

    if best_result[2] > 75.0:
        return best_result


# install_drive = 'C:/'
# eft_version = 'EFT 3.8/'

# item_path = install_drive + eft_version + 'Aki_Data/Server/database/templates/items.json'

# item_data = load_json(item_path)

# new_item_dict = {}

# x = 1
# for key in item_data.keys():
#     try:
#         new_item_dict[str(x)] = {
#         'name' : item_data[key]['_props']['Name'],
#         #'localeName' : item_data[key]['locale']['Name'],
#         'shortName' : item_data[key]['_props']['ShortName'],
#         #'localeshortName' : item_data[key]['locale']['ShortName'],
#         'image' : item_data[key]['_props']['Prefab']['path']}
#         x += 1
#     except:
#         pass



# rename all files in a folder to lowercase, swap - for _, remove icon
image_folder = 'C:/Users/eric/tarkov-shopper/public/images/'
image_list = os.listdir(image_folder)
    
for image in range(len(image_list)):
    os.renames(image_folder+image_list[image], image_folder+image_list[image].lower())
    os.renames(image_folder+image_list[image], image_folder+image_list[image].replace('-', '_'))
    os.renames(image_folder+image_list[image], image_folder+image_list[image].replace('_icon', ''))
    os.renames(image_folder+image_list[image], image_folder+image_list[image].replace('icon', ''))
        
json_folder = 'C:/Users/eric/tarkov-shopper/public/'
json_data = load_json(json_folder+'data.json')
image_path = json_folder + 'images/'
delete_list = []

# remove all rows without a shortname
# generally these are dev items or objects like crates, body meshes, etc.
# has to be run a couple times because the indexs get messed up when an item
# is removed
# for row in range(len(json_data)):
#     if json_data[row]['shortname'] == '':
#         del json_data[row]
#         #delete_list.append(json_data[row])

match_list = []

for image in image_list:
    #print(image.split('_')[0])
    for row in range(len(json_data)):
        # name match
        result = [build_match_list(json_data[row]['name'],image.split('.')[0]),
                  build_match_list(json_data[row]['shortname'],image.split('.')[0])]
        if result[0] != None or result[1] != None:
            match_list.append(result)

any(match_list[0])

no_image_list = []
for row in range(len(json_data)):
    if json_data[row]['image'] == '':
        no_image_list.append(json_data[row])
        
# format back to json
json_object = json.dumps(json_data, indent=4)

# write out to file
with open('data.json', 'w') as outfile:
    outfile.write(json_folder+json_object)