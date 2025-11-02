#!/bin/sh

set -e
set -x

sh ./bin/development/inv_item_maintenance_applet_publish.sh
sh ./bin/staging/inv_item_maintenance_applet_publish.sh
sh ./bin/prod/inv_item_maintenance_applet_publish.sh