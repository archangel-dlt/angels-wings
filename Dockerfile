FROM circleci/python:3.7.4-node

CMD "./start-angels-wings-server.sh"

COPY scripts/start-angels-wings-server.sh .
RUN sudo chmod 555 start-angels-wings-server.sh

COPY image-hash /image-hash
RUN cd image-hash && sudo pip3 install -r requirements.txt
RUN python3 image-hash/bootstrap.py

COPY web-server /web-server
RUN sudo chmod 777 /web-server
RUN cd web-server && npm install
RUN sudo chmod 755 /web-server

COPY web-frontend/build/* /web-server/static/

