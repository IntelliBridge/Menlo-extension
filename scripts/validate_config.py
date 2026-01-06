import yaml, json, sys
from jsonschema import validate

def load_yaml(path):
    with open(path) as f:
        return yaml.safe_load(f)

def validate_file(data, schema_path):
    with open(schema_path) as f:
        schema = json.load(f)
    validate(instance=data, schema=schema)

try:
    validate_file(load_yaml("config/environments.yaml"), "schema/environments.schema.json")
    validate_file(load_yaml("metadata/metadata.yaml"), "schema/metadata.schema.json")
except Exception as e:
    print(f"❌ Validation failed: {e}")
    sys.exit(1)

print("✅ Configuration validation passed")
