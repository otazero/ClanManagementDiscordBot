FROM node:18-bullseye-slim

# ロケールを設定する
ENV LANG ja_JP.UTF-8

# タイムゾーンを設定する
ENV TZ Asia/Tokyo

# 	chromium-browserのダウンロードファイルをコピーする
ADD ./chromiums/chromium-browser_112.0.5615.49-0ubuntu0.18.04.1_armhf.deb /tmp/
ADD ./chromiums/chromium-browser_112.0.5615.49-0ubuntu0.18.04.1_arm64.deb /tmp/
ADD ./chromiums/chromium-codecs-ffmpeg-extra_112.0.5615.49-0ubuntu0.18.04.1_arm64.deb /tmp/
ADD ./chromiums/chromium-codecs-ffmpeg-extra_112.0.5615.49-0ubuntu0.18.04.1_armhf.deb /tmp/

RUN apt-get update --allow-insecure-repositories \
    && apt-get upgrade -y \
    && apt-get install -y fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends  \
    # armv7l アーキテクチャ用
    && if [ "$(uname -m)" = "armv7l" ] ; then \
        apt-get install -y libcairo2 libpango-1.0-0 libasound2 libatk-bridge2.0-0 libatk1.0-0 libatspi2.0-0 libcups2 libdbus-1-3 libdrm2  libgbm1  libnspr4  libnss3  libxcomposite1  libxdamage1  libxfixes3  libxkbcommon0  libxrandr2  libxtst6  libx11-xcb1  xdg-utils \
        # && dpkg -i /tmp/chromium-codecs-ffmpeg_112.0.5615.49-0ubuntu0.18.04.1_armhf.deb \
        && dpkg -i /tmp/chromium-codecs-ffmpeg-extra_112.0.5615.49-0ubuntu0.18.04.1_armhf.deb \
        && dpkg -i /tmp/chromium-browser_112.0.5615.49-0ubuntu0.18.04.1_armhf.deb \
        && rm /tmp/chromium-codecs-ffmpeg-extra_112.0.5615.49-0ubuntu0.18.04.1_armhf.deb \
        && rm /tmp/chromium-browser_112.0.5615.49-0ubuntu0.18.04.1_armhf.deb \
        && rm -rf /var/lib/apt/lists/* ; \
    # Arm64 アーキテクチャ用
    elif [ "$(uname -m)" = "aarch64" ] ; then \
        apt-get install -y libcairo2 libpango-1.0-0 libasound2 libatk-bridge2.0-0 libatk1.0-0 libatspi2.0-0 libcups2 libdbus-1-3 libdrm2  libgbm1  libnspr4  libnss3  libxcomposite1  libxdamage1  libxfixes3  libxkbcommon0  libxrandr2  libxtst6  libx11-xcb1  xdg-utils \
        && dpkg -i /tmp/chromium-codecs-ffmpeg-extra_112.0.5615.49-0ubuntu0.18.04.1_arm64.deb  \
        && dpkg -i /tmp/chromium-browser_112.0.5615.49-0ubuntu0.18.04.1_arm64.deb \
        && rm /tmp/chromium-codecs-ffmpeg-extra_112.0.5615.49-0ubuntu0.18.04.1_arm64.deb \
        && rm /tmp/chromium-browser_112.0.5615.49-0ubuntu0.18.04.1_arm64.deb \
        && rm -rf /var/lib/apt/lists/* ; \
    # x86_64 アーキテクチャ用
    elif [ "$(uname -m)" = "x86_64" ] ; then \
        apt-get install -y chromium \      
        && rm -rf /var/lib/apt/lists/* ; \
    fi

WORKDIR /app

# buildディレクトリを作成する
RUN mkdir build

COPY package*.json ./
RUN npm install

COPY . .

# TypeScriptをコンパイル
RUN npm run compile

# MySQLの設定ファイルをコピーする
COPY ./my.cnf /etc/mysql/my.cnf

# ポート番号を設定する
EXPOSE 3000

CMD ["npm", "run", "start"]