
NAME = beacon
VERSION = 0.5
TEMPDIR = /tmp/$(NAME)-$(VERSION)

prefix = /usr
sysconfdir = /etc

installdir = $(prefix)/share
httpdconfd = $(sysconfdir)/httpd/conf.d

SOURCES = beacon php docs httpd-beacon.conf TODO \
	LICENSE README Makefile

dist:
	@rm -rf $(TEMPDIR)
	@mkdir -p $(TEMPDIR)
	@cp -rp  $(SOURCES) $(TEMPDIR)/
	@(cd /tmp/; tar -czf $(NAME)-$(VERSION).tar.gz $(NAME)-$(VERSION)/)
	@mv /tmp/$(NAME)-$(VERSION).tar.gz .
	@rm -rf $(TEMPDIR)

install:
	@mkdir -p $(installdir)/beacon $(httpdconfd)
	@cp -rp beacon php $(installdir)/beacon/
	@find $(installdir)/beacon -type f -exec chmod o=r {} \;
	@find $(installdir)/beacon -type d -exec chmod o=rx {} \;
	@cp -p httpd-beacon.conf $(httpdconfd)/httpd-beacon.conf

clean:
	@rm -f httpd-beacon.conf $(NAME)-$(VERSION).tar.gz

uninstall:
	@rm -rf $(installdir)/beacon
	@rm -rf $(httpdconfd)/httpd-beacon.conf
