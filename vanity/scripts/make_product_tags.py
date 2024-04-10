import pandas as pd

product_info_path = 'scripts/product_info 2.csv'
tags_path = 'scripts/Tags_cleaned.csv'
product_info_df = pd.read_csv(product_info_path)
tags_df = pd.read_csv(tags_path)
tag_mapping = dict(zip(tags_df['Tag'].str.lower(), tags_df['TagId']))
expanded_product_names = product_info_df['product_name'].str.lower().str.split(expand=True).stack().reset_index(level=1, drop=True).to_frame('word')
expanded_product_names['product_id'] = product_info_df.loc[expanded_product_names.index, 'product_id']
expanded_product_names['TagId'] = expanded_product_names['word'].map(tag_mapping)
expanded_product_names.dropna(subset=['TagId'], inplace=True)
expanded_product_names['TagId'] = expanded_product_names['TagId'].astype(int)
final_product_tags_df = expanded_product_names[['product_id', 'TagId']].rename(columns={'product_id': 'ProductId'})
final_product_tags_df['TagId'] = final_product_tags_df['TagId'].astype(int)
final_product_tags_df.to_csv('scripts/ProductTags.csv', index=False)