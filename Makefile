config-test:
	ansible-vault view config/test.yml.vault > config/test.yml

config-dev:
	ansible-vault view config/development.yml.vault > config/development.yml

config-prod:
	ansible-vault view config/production.yml.vault > config/production.yml
