#!/bin/bash
nginx -g 'daemon off;' &
./app $@
