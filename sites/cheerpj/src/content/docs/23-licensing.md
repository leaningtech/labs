---
title: Licensing
---

CheerpJ is free for personal, educational and hobby use, and for technical evaluation by organisations of any size. One-person companies and non-commercial open-source projects can also use it for free, with a "Built with CheerpJ" credit. Business use needs a licence.

This page summarises the licences with examples. The full terms, prices and a licence finder are on [cheerpj.com/licensing][licensing].

## Two kinds of licence

A CheerpJ licence depends on who uses the application, not on how CheerpJ is integrated.

- **Desktop licences** cover Java applications your organisation uses, such as Oracle Forms, Oracle E-Business Suite, applets, Java Web Start applications and your own Java clients. They are priced per desktop: each machine whose browser runs CheerpJ.
- **Application licences** cover software you build with CheerpJ for customers or the public, including commercial products and SaaS. They are priced per developer or per application.

A Desktop licence covers CheerpJ Core, the Applet Runner and the JNLP Runner on that desktop.

## Free use

The **Community** licence is free, and covers:

- Personal, educational and hobby use
- Technical evaluation, for organisations of any size
- Software published by an individual or a one-person company, including paid software, with a "Built with CheerpJ" credit
- Non-commercial free and open-source (FOSS) projects, loading CheerpJ from the CheerpJ CDN, with a "Built with CheerpJ" credit

Community use loads CheerpJ from the CheerpJ CDN (`cjrtnc.leaningtech.com`), with no metering. Applications running without a licence key show a non-commercial licence message on the CheerpJ display.

## Examples

| Use case                                                                                      | Licence                                                              |
| :-------------------------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| You build a Java game or educational applet and publish it on your own website                | Community, free                                                      |
| You are a one-person company selling a Java application that runs in the browser              | Community, free, with a "Built with CheerpJ" credit                  |
| You maintain a non-commercial open-source project and put a web demo of it online             | Community, free, with a "Built with CheerpJ" credit                  |
| Your company tests whether its Java application runs with CheerpJ before rolling it out       | Community, free, as a [technical evaluation](#technical-evaluations) |
| Your staff open Oracle Forms or EBS in the browser through CheerpJ                            | [Desktop][licensing], per desktop                                    |
| Your company runs an internal Swing application for its employees with CheerpJ Core           | [Desktop][licensing], per desktop                                    |
| Your company uses the Applet Runner or JNLP Runner to reach an internal or vendor application | [Desktop][licensing], per desktop                                    |
| A startup offers a web edition of its Java product to customers                               | [Application][licensing]: Small Business or Enterprise               |
| An open-source project backed by a company that sells support, hosting or a paid edition      | [Application][licensing]: Small Business or Enterprise               |
| A software vendor ships CheerpJ inside a product that its customers host themselves           | [Application][licensing]: Enterprise, with an OEM licence            |

If your case is not listed, the [licence finder][licensing] on cheerpj.com asks a few questions and suggests one, or [contact us][contact].

## Technical evaluations

Technical evaluation is free for organisations of any size. An application is in technical evaluation while internal or external users do not use it.

**This includes:**

- An application that is not yet in production
- An application that is not yet available to the public
- Testing compatibility with CheerpJ for a potential project

**This does not include:**

- An internal application that employees use

## Self-hosting

Serving the CheerpJ runtime from anywhere other than the CheerpJ CDN counts as self-hosting, including copying it into your own repository, package or CDN. Self-hosting is:

- Allowed during technical evaluation
- Available as an add-on with Small Business licences
- Included with Enterprise licences, which also provide a self-hosted build that contacts no external server and works on air-gapped networks

See [server setup](/docs/guides/basic-server-setup) for how to serve CheerpJ.

## Licence keys

A licence comes with a key, passed to CheerpJ with the [`licenseKey`](/docs/reference/cheerpjInit#licensekey) option of `cheerpjInit`. A valid key removes the non-commercial licence message from the CheerpJ display.

## System integrators, resellers and OEMs

A licence belongs to the organisation whose users run the application, or to the vendor that ships it. A system integrator's licence does not cover its clients. To offer CheerpJ as part of your services, or to redistribute it, [contact us][contact] about partner, reseller and OEM licences.

---

If you are not sure which licence you need, [contact us][contact]. Full licensing details are on [cheerpj.com/licensing][licensing].

[licensing]: https://cheerpj.com/licensing/
[contact]: https://cheerpj.com/contact/
