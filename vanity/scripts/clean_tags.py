from collections import OrderedDict
import re
import pandas as pd
import pandas as pd

df = pd.read_csv('scripts/product_info 2.csv')

# CODE CITATION: CS498CC MP1 stopwords and delimiters list from https://github.com/UIUC-CS498-Cloud, derived from https://gist.github.com/sebleier/554280
stop_words_list = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours",
                   "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its",
                   "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that",
                   "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having",
                   "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while",
                   "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before",
                   "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again",
                   "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each",
                   "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than",
                   "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]
delimiters = " \t,;.?!-:@[](){}_*/"

pattern = '|'.join(map(re.escape, delimiters))
tags = OrderedDict()
for product_name in df['product_name']:
    words = re.split(pattern, product_name)
    for word in words:
        if word and word.lower() not in stop_words_list:
            tags[word] = None
for index, tag in enumerate(tags, start=1):
    tags[tag] = index
tags_df = pd.DataFrame(list(tags.items()), columns=['Tag', 'TagId'])
tags_df= tags_df[['TagId', 'Tag']]
tags_df['Standing'] = 1
categories_combined = pd.concat([df['primary_category'], df['secondary_category'], df['tertiary_category']]).drop_duplicates().dropna()
new_tags = [{'TagId': tag_id, 'Tag': tag, 'Standing': 2} for tag_id, tag in enumerate(categories_combined, start=tags_df['TagId'].max() + 1)]
new_tags_df = pd.DataFrame(new_tags)
updated_tags_df = pd.concat([tags_df, new_tags_df], ignore_index=True)
updated_tags_df['Tag_lower'] = updated_tags_df['Tag'].str.lower()
final_tags_df = updated_tags_df.drop_duplicates(subset='Tag_lower', keep='first')
final_tags_df = final_tags_df.drop(columns=['Tag_lower'])
tags_csv_path = 'scripts/Tags.csv'
final_tags_df.to_csv(tags_csv_path, index=False)
