CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS frames (
id       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
ts       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    width    INTEGER,
    height   INTEGER,
    nDet     INTEGER,
    latencies JSONB
);

CREATE TABLE IF NOT EXISTS detections (
id        uuid   PRIMARY KEY DEFAULT gen_random_uuid(),
frame_id  uuid   NOT NULL REFERENCES public.frames(id) ON DELETE CASCADE,
cls_id    INTEGER,
cls_name  TEXT,
conf      DOUBLE PRECISION,
x1        INTEGER,
y1        INTEGER,
x2        INTEGER,
y2        INTEGER
);

CREATE INDEX IF NOT EXISTS idx_detections_frame_id
ON detections(frame_id);
