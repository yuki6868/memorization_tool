from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy import Column, Integer, String, DateTime
from database import Base
from datetime import datetime

# ==================================================
# モデル
# ==================================================
# memosテーブル用：モデル
class Memo(Base):
    # テーブル名
    __tablename__ = "memos"
    # メモID：PK：自動インクリメント
    memo_id = Column(Integer, primary_key=True, autoincrement=True)
    # タイトル：未入力不可
    title = Column(String(50), nullable=False)
    # 詳細：未入力可
    description = Column(String(255), nullable=True)
    # 作成日時
    created_at = Column(DateTime, default=datetime.now(),nullable=True)
    # 更新日時
    updated_at = Column(DateTime, nullable=True)
    # 学習日時
    studied_on = Column(Date, nullable=False)
    # レビュー間隔
    # reviews = relationship("ReviewSchedule", back_populates="learning_item", lazy="joined")
    review_day = Column(DateTime, nullable=True)