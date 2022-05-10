
up:
	docker run --name reefswap -dp 80:80 reefswap

rebuild:
	docker build -t reefswap .

down:
	docker stop reefswap && docker rm reefswap