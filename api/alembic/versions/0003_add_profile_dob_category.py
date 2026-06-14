"""add dob and category to profiles

Revision ID: 0003
Revises: 0002
Create Date: 2026-06-13

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("profiles", sa.Column("dob", sa.Date(), nullable=True))
    op.add_column("profiles", sa.Column("category", sa.String(length=40), nullable=True))


def downgrade() -> None:
    op.drop_column("profiles", "category")
    op.drop_column("profiles", "dob")
