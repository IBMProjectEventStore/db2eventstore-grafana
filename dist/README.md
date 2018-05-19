# IBM Db2 Event Store Graphana visualization

The IBM Db2 Event Store is an in-memory database optimized for event-driven data processing and analysis. [Download the free developer edition or the enterprise edition](https://www.ibm.com/us-en/marketplace/db2-event-store)

In order to visualize your data with Graphana, follow the steps below:

## Grafana Datasource

The IBM Db2 Event Store backend implements 2 urls:
* `/` will return 200 ok. This is used for "Test connection" on the datasource config page
* `/query` will return metrics based on input

## Prerequisites

* An [IBM Db2 Event Store Enterprise Edition cluster](https://www.ibm.com/us-en/marketplace/db2-event-store)

## Installation of Graphana within an IBM Db2 Event Cluster

```bash
sudo yum install -y wget
sudo wget https://s3-us-west-2.amazonaws.com/grafana-releases/release/grafana-5.0.0-1.x86_64.rpm
sudo yum install -y initscripts freetype fontconfig urw-fonts
sudo rpm -Uvh grafana-5.0.0-1.x86_64.rpm
sudo service grafana-server start
```

## Install the Grafana Plugin within an IBM Db2 Event Cluster
mkdir -p /usr/local/var/lib/grafana/plugins/db2-event-store
cd /usr/local/var/lib/grafana/plugins/db2-event-store
wget ...
cp /usr/local/var/lib/grafana/plugins/db2-event-store/db2-event-store-grafana.tar .

```bash
GRAFANA=/var/lib/grafana
sudo mkdir -p $GRAFANA/plugins/db2-event-store
sudo rm -rf $GRAFANA/plugins/db2-event-store/*
sudo cp db2-event-store-grafana.tar $GRAFANA/plugins/db2-event-store
cd $GRAFANA/plugins/db2-event-store
sudo tar -zxvf db2-event-store-grafana.tar
sudo service grafana-server restart
```

## Bring up the Graphana console

## Establish a dashboard
