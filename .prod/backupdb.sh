#!/usr/bin/env bash
ssh -t root@91.134.136.54 'export LC_ALL=C;mongodump --port 27017'
