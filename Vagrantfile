# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  # https://docs.vagrantup.com.
  config.vm.box = "debian/jessie64"
  config.vm.box_version = "8.2.1"

  config.vm.hostname = "tangerineserver"

  config.vm.define "tangerineserver" do |tangerineserver|
  end

  config.vm.provider "virtualbox" do |vb|
    vb.name = "tangerineserver"
  end

  config.vm.network "forwarded_port", guest: 80, host: 1234 
  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get install git -y
    git clone https://github.com/Tangerine-Community/server.git 
    # cd server
    # ./server-init.sh
  SHELL
end
