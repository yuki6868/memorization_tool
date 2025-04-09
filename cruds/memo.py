from datetime import timedelta, datetime, date
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import models.memo as memo_model
from sqlalchemy import Column, Integer, String, DateTime
import schemas.memo as memo_schema
from database import Base

async def insert_memo(db: AsyncSession, item: memo_schema.InsertAndUpdateMemoSchema):
    db_item = memo_model.Memo(title=item.title, description=item.description, studied_on=item.studied_on, review_day=item.studied_on)
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)

    # 復習スケジュール：1日後、7日後、30日後
    if item.radio == "理解できた":
        intervals = [1, 7, 30, 60]
    else:
        intervals = [1, 7, 14, 30, 60]
    for i in intervals:
        review_do = item.studied_on + timedelta(days=i)
        review = memo_model.Memo(title=item.title, description=item.description, studied_on=item.studied_on, review_day=review_do)
        db.add(review)

    await db.commit()
    await db.refresh(db_item)
    return db_item

# 全件取得(その日だけのものを出力する)
async def get_memos(db_session: AsyncSession) -> list[memo_model.Memo]:
    """
        データベースから全てのメモを取得する関数
        Args:
            db_session (AsyncSession): 非同期DBセッション
        Returns:
            list[Memo]: 取得された全てのメモのリスト
    """
    # 今日の日付を取得（YYYY-MM-DD形式）
    today = date.today()
    print("=== 全件取得：開始 ===")
    result = await db_session.execute(select(memo_model.Memo))
    memos = result.scalars().all()
    if memos:
        res_memo = []
        for memo in memos:
            if datetime.date(memo.review_day) == today:
                res_memo.append(memo)
        memos = res_memo
    print(">>> データ全件取得完了")
    return memos

# 1件取得
async def get_memo_by_id(db_session: AsyncSession,
        memo_id: int) -> memo_model.Memo | None:
    """
        データベースから特定のメモを1件取得する関数
        Args:
            db_session (AsyncSession): 非同期DBセッション
            memo_id (int): 取得するメモのID（プライマリキー）
        Returns:
            Memo | None: 取得されたメモのモデル、メモが存在しない場合はNoneを返す
    """
    print("=== １件取得：開始 ===")
    result = await db_session.execute(
    select(memo_model.Memo).where(memo_model.Memo.memo_id == memo_id))
    memo = result.scalars().first()
    print(">>> データ取得完了")
    return memo

# 更新処理
async def update_memo(
        db_session: AsyncSession,
        memo_id: int,
        target_data: memo_schema.InsertAndUpdateMemoSchema) -> memo_model.Memo | None:
    """
        データベースのメモを更新する関数
        Args:
            db_session (AsyncSession): 非同期DBセッション
            memo_id (int): 更新するメモのID（プライマリキー）
            target_data (InsertAndUpdateMemoSchema): 更新するデータ
        Returns:
            Memo | None: 更新されたメモのモデル、メモが存在しない場合はNoneを返す
    """
    print("=== データ更新：開始 ===")
    memo = await get_memo_by_id(db_session, memo_id)
    if memo:
        memo.title = target_data.title
        memo.description = target_data.description
        memo.updated_at = datetime.now()
        await db_session.commit()
        await db_session.refresh(memo)
        print(">>> データ更新完了")
        
    return memo

# 削除処理
async def delete_memo(
        db_session: AsyncSession, memo_id: int
        ) -> memo_model.Memo | None:
    """
        データベースのメモを削除する関数
        Args:
            db_session (AsyncSession): 非同期DBセッション
            memo_id (int): 削除するメモのID（プライマリキー）
        Returns:
            Memo | None: 削除されたメモのモデル、メモが存在しない場合はNoneを返す
    """
    print("=== データ削除：開始 ===")
    memo = await get_memo_by_id(db_session, memo_id)
    if memo:
        await db_session.delete(memo)
        await db_session.commit()
        print(">>> データ削除完了")
    
    return memo