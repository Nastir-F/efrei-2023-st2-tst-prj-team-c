# ST2 Software Testing Project for EFREI (2022/2023 edition)

## Introduction

This repository contains all the information you need to complete the
project for the ST2 Software Testing course.

It will be updated from time to time, you're advised to watch changes made
in this repository.

## Rules

* Be nice!
* Do *not* do load testing - all the instances share the same server, and that
  could prevent other teams from working on the project ...
* Tell me when you think something is wrong
* No plagiarism. You can use code written by someone else, but in that case, make it clear when it comes from (URL if you find it online, name of the team/person if you borrowed the code from an other team)


## Overview

You will be using a web application (Human Relations Database Manager), or hr-db for short.

There a 23 instances deployed on my server. From `https://a.hr.dmerej.info` to
`https://z.hr.dmerej.info` - each team has its own instance. Please only use your instance!

Each instance shares the same code, and the production code is intentionally buggy (at least 3 bugs, probably more)

During the project, you will be testing the web application using various techniques:

* Black-box testing: designing and running test plans by hand
* Acceptance testing: writing end-to-end tests using selenium or playwright
* Unit testing: when you'll have access to the source code

You should choose one language among *Python, JavaScript, Java, C#* and stick with it for the duration of the project

## Grading

There will be several kind of deliveries:

* A log that you should update at every session with your actions, what you tried, what you learned, and so on.
* Some test code

The log will be graded on:

* readability
* how much you put things into perspective

The test code will be graded:

* quality of the code - test code should be easy to read, write and maintain
* coverage of the test code

In addition, you will have to produce other deliveries depending on the session.

## Specifications for the HR database

* Every field concerning the Employee information is mandatory
* The zip code of any address should be an integer

## Sequence 1 - first run of manual testing

*Note1: as an exception to the rule, you should not interact with other
teams during this session. I want to see how many bugs you can find by
yourselves without any indication.*

*Note2: technically, address, emails and the like are personal data and are thus
protected by the law. Only put *fictional* data in the db when doing your tests!*


### Design a test plan.

At the minimum, a test plan should contain:

* a template with the lists of tests, each containing an *id* and a *description*
* several "runs", each generated from the template, each containing a *date* and the *outcome* of each test (*pass* or *fail*).

### Run the test plan

Once the test plan has been written, use all members of the team to perform a run, running the tests by hand on your instance.

Find as many bugs as possible.

### Add bugs to a bug tracker

1. Set up a bug tracker. You may use the built-in issue tracker of GitHub or GitLab for instance
2. Add all the bugs you found during the first run of the test plan to the tracker
3. Send me the link to the bug tracker link by email

## Sequence 2 - second run of manual testing

1. Wait for the next release of the web application.
2. Run a second test plan
3. Update the bug tracker accordingly
4. Send me the bug tracker link by email
5. Send me the two test plan runs by email

## Sequence 3 - test automation with Playwright

1. Choose one of the languages supported by [playwright](https://playwright.dev/) -
   TypeScript, JavaScript, Python, .Net, Java
1. Install a web driver using the `playwright` command line if needed.
1. Start to automate tests from the previous sequence, but *take your time*, I
   want to see **maintainable test code**.

*Note*: by default, you may end up with running tests on several browsers (Firefox, Chrome, ...). Since the goal is for you to *write test code*, it's fine if you
run all the tests only with the Chrome driver.

## Sequence 4 - integration tests

1. Choose a language and add missing integration tests

## Finale

* What do you think of the various testing strategies we used during the 4 sequences?
* Can you list their pros and cons?

## Commands to use in the project
To install depedencies:
```
npm i
```

To install playwright:
```
npx playwright install
```

To generate code for testing the website:
```
npx playwright codegen c.hr.dmerej.info/
```

To start all the tests:
```
npx playwright test
```
