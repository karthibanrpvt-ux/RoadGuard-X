import argparse
from pathlib import Path

import pandas as pd
import yaml


def load_params(params_path: Path) -> dict:
    with params_path.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def main() -> None:
    parser = argparse.ArgumentParser(description="Prepare and clean dataset manifest")
    parser.add_argument("--input", required=True, help="Path to raw CSV manifest")
    parser.add_argument("--output", required=True, help="Path to cleaned CSV output")
    parser.add_argument(
        "--params", default="params.yaml", help="Path to params.yaml for preprocessing rules"
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)
    params = load_params(Path(args.params))

    if not input_path.exists():
        raise FileNotFoundError(f"Input manifest not found: {input_path}")

    cfg = params.get("prepare_data", {})
    required_columns = cfg.get("required_columns", [])
    deduplicate_by = cfg.get("deduplicate_by", [])

    df = pd.read_csv(input_path)

    missing = [c for c in required_columns if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns in {input_path}: {missing}")

    clean = df.dropna(subset=required_columns).copy()
    if deduplicate_by:
        clean = clean.drop_duplicates(subset=deduplicate_by)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    clean.to_csv(output_path, index=False)

    print(f"Prepared rows: {len(clean)}")
    print(f"Saved: {output_path}")


if __name__ == "__main__":
    main()
