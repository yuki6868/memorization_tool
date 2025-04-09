from pydantic import BaseModel, Field
from datetime import date
from typing import List, Optional

# ==================================================
# スキーマ定義
# ==================================================
# 登録・更新で使用するスキーマ
class InsertAndUpdateMemoSchema(BaseModel):
    # メモのタイトル。このフィールドは必須です。
    title: str = Field(...,
            description="メモのタイトルを入力してください。少なくとも1文字以上必要です。",
            example="明日のアジェンダ", min_length=1)
    # メモの詳細説明。このフィールドは任意で入力可能です。
    description: Optional[str] = Field(default=None,
            description="メモの内容についての追加情報。任意で記入できます。",
            example="会議で話すトピック：プロジェクトの進捗状況")
    # メモの開始日時。
    studied_on: date = Field(default="",
            description="その項目を開始した時期。",
            example="2025/4/7")
    
    # 手応え。
    radio: str = Field(default="",
            description="手応え",
            example="ちょっと不安")

# メモ情報を表すスキーマ
class MemoSchema(InsertAndUpdateMemoSchema):
    # メモの一意識別子。データベースでユニークな主キーとして使用されます。
    memo_id: int = Field(...,
            description="メモを一意に識別するID番号。データベースで自動的に割り当てられます。",
            example=123)

# レスポンスで使用する結果用スキーマ
class ResponseSchema(BaseModel):
    # 処理結果のメッセージ。このフィールドは必須です。
    message: str = Field(...,
        description="API操作の結果を説明するメッセージ。",
        example="メモの更新に成功しました。")
    
class ReviewScheduleSchema(BaseModel):
    review_date: date
    status: Optional[str] = None

    class Config:
        orm_mode = True

class LearningItemCreate(BaseModel):
    title: str
    description: Optional[str] = None
    studied_on: date
    radio: str

class LearningItemSchema(BaseModel):
    id: int
    title: str
    studied_on: date
    # reviews: List[ReviewScheduleSchema]
    review_date: date

    class Config:
        from_attributes = True