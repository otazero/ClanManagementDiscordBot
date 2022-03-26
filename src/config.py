import os
from dotenv import load_dotenv

# .envファイルの内容を読み込む
load_dotenv()

# 環境変数を変数に格納
BOT_TOKEN = os.environ['BOT_TOKEN']