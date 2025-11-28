# Build stage installs Python dependencies using pipenv
FROM python:3.14-slim AS builder

WORKDIR /workspace

COPY Pipfile Pipfile.lock ./
RUN python -m pip install --no-cache-dir pipenv && \
    pipenv sync --system

COPY ./ ./

# Final runtime image copies the finished app and installed packages
FROM python:3.14-slim

WORKDIR /app

COPY --from=builder /workspace /app
COPY --from=builder /usr/local/lib/python3.14 /usr/local/lib/python3.14
COPY --from=builder /usr/local/bin /usr/local/bin

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
