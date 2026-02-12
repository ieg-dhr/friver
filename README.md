# ortstermine-petrify

This is the source code repository for the [Europäische Friedensverträge der
Vormoderne online](ieg-friedensvertraege.de/friverplus) project at the
[Leibniz-Institut für Europäische Geschichte Mainz](https://ieg-mainz.de).

## Development

Building the static page should work on every major linux distribution. We
tested the process on Arch Linux.

Install requirments:

* git >= v2.41.0 (for Windows, download and install the
  [most recent version](https://git-scm.com/download/win), use all defaults,
  when asked, select your preferred editor and also choose "Use Git from Git
  Bash only")
* ruby >= v3.2.0 (for Windows, we recommend following the
  [ruby install documentation provided by the jekyll project](https://jekyllrb.com/docs/installation/windows/))
* nodejs >= v20.0.0 (for Windows, download and install the
  [most recent LTS version](https://nodejs.org/en/download), use all defaults,
  when asked, opt-in to install the "necessary tools" and choose to installing
  Python and the Windows Power Shell)

Now download the sources from this repository and unpack them or do a git
checkout. Then open a terminal prompt (e.g. git bash on Windows) and
navigate to the directory where the source files are located. Once there,
install all required libraries:

```bash
cd ~/Desktop/ieg-fv
bundle install
npm install
```

Also, clone the data repository with

```
git clone https://github.com/ieg-dhr/friver-plus data
```

The data repository comes as a set of XML files. Run the import task to extract
the metadata information required for the search feature. This process needs to
be run only once (and whenever the translations.xlsx file was changed):

```
npm run import
```

Now run the app with

```
npm run dev
```

... then open a browser and go to http://localhost:4000. The app build rebuild
and auto-reload when changes are made to the source files. To stop the process,
hit `ctrl-c`.

## Deployment

To build the app for production, install the requirements as listed above and
change `bin/production.sh` to match your deployment. Then run it:

```
bin/build-production.sh
```

This builds a production-ready version to the `public` directory. Copy its
contents to your webserver. The directory contains symlinks, make sure to
replace those with their respective targets.



# Licenses, links

* https://html.spec.whatwg.org/entities.json
* https://unsplash.com/photos/birds-on-roof-shingle-aq2u-OMPw4U
* https://openclipart.org/detail/320578/dove
* https://openclipart.org/detail/238740/prismatic-tiled-peace-dove
* https://publicdomainvectors.org/en/free-clipart/Flying-Dove-Silhouette/43962.html
* https://publicdomainvectors.org/en/free-clipart/Map-of-Europe-in-dark-blue-color/35234.html
