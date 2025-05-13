import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import sys

# ==================================================
# DBアクセス
# ==================================================
# ベースクラスの定義
Base = declarative_base()

# DBファイル作成
# アプリ化した場合、実行パスが異なるので、リソースのパスを解決する
if getattr(sys, 'frozen', False):
    # アプリケーションがパッケージされた場合のパス
    base_dir = os.path.dirname(sys.executable)
else:
    # 通常実行の場合
    base_dir = os.path.dirname(os.path.abspath(__file__))
# base_dir = os.path.dirname(os.path.abspath(__file__))
# base_dir = os.path.dirname(sys.executable)
# データベースのURL
DATABASE_URL = 'sqlite+aiosqlite:///' + os.path.join(base_dir, 'memodb.sqlite')
print('Database_url',DATABASE_URL)

# 非同期エンジンの作成
engine = create_async_engine(DATABASE_URL, echo=True)

# 非同期セッションの設定
async_session = sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession
)

# DBとのセッションを非同期的に扱うことができる関数
async def get_dbsession():
    async with async_session() as session:
        yield session
