"""add waitlist_entries table

Revision ID: 0005
Revises: 0004
Create Date: 2026-07-12

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0005"
down_revision: Union[str, None] = "0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "waitlist_entries",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=40), nullable=False),
        sa.Column("source", sa.String(length=60), nullable=False, server_default="landing"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
    )
    op.create_index("ix_waitlist_email", "waitlist_entries", ["email"])
    op.create_index("ix_waitlist_created", "waitlist_entries", ["created_at"])


def downgrade() -> None:
    op.drop_index("ix_waitlist_created", table_name="waitlist_entries")
    op.drop_index("ix_waitlist_email", table_name="waitlist_entries")
    op.drop_table("waitlist_entries")
