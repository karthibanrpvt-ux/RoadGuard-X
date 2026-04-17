import argparse
from pathlib import Path

import pandas as pd
from evidently.metric_preset import DataDriftPreset
from evidently.report import Report


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Evidently data drift report")
    parser.add_argument("--reference", required=True, help="Path to baseline/reference CSV")
    parser.add_argument("--current", required=True, help="Path to current batch CSV")
    parser.add_argument(
        "--output",
        default="reports/data_drift_report.html",
        help="Path to output HTML report",
    )
    args = parser.parse_args()

    reference_path = Path(args.reference)
    current_path = Path(args.current)
    output_path = Path(args.output)

    if not reference_path.exists():
        raise FileNotFoundError(f"Reference data not found: {reference_path}")
    if not current_path.exists():
        raise FileNotFoundError(f"Current data not found: {current_path}")

    reference_df = pd.read_csv(reference_path)
    current_df = pd.read_csv(current_path)

    report = Report(metrics=[DataDriftPreset()])
    report.run(reference_data=reference_df, current_data=current_df)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    report.save_html(str(output_path))
    print(f"Drift report saved to: {output_path}")


if __name__ == "__main__":
    main()
