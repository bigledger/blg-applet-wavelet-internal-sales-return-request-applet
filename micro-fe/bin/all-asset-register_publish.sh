#!/bin/sh

set -e
set -x

sh ./bin/development/asset_register_applet_publish.sh
sh ./bin/staging/asset_register_applet_publish.sh
sh ./bin/prod/inv_item_maintenance_applet_publish.sh
