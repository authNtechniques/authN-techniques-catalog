# Contributing to the Authentication Techniques Catalog

Contributions are made via merge requests. Clone the project, create a new branch, commit your changes, and open a merge request to get them merged into the main branch.

## Setting Up

```bash
git clone https://git.rwth-aachen.de/swc-public/security-patterns/authentication-methods-catalog.git
git checkout -b your-branch-name
```

For instructions on running or building the application locally, see the [README](README.md).

---

## Contributing a Technique

Follow these steps to add a new authentication technique:

1. Copy the template `./authentication-techniques/0_default_technique_template.json`, name it after your technique, and place it in the `authentication-techniques/` folder.
2. Fill out **all fields** in the template. For guidance on the expected values for each field, refer to [A FACETED CLASSIFICATION OF AUTHENTICATOR-CENTRIC AUTHENTICATION TECHNIQUES](#TODO).
3. For the `authenticators` field, check whether a suitable authenticator already exists in `./authenticators/`. If so, reference it directly — you do not need to add a new one. If no suitable authenticator exists, add one following the [Contributing an Authenticator](#contributing-an-authenticator) steps below.
4. Copy the checklist template `./checklists/0_default_checklist_template.md`, name it to match your technique file, and place it in the `checklists/` folder. Fill it out to justify the inclusion of the technique in the catalog.
5. Commit your changes and open a **merge request** on the [Authentication Techniques Catalog GitLab Repository](https://git.rwth-aachen.de/swc-public/security-patterns/authentication-methods-catalog.git).

---

## Contributing an Authenticator

Only needed if no existing authenticator in `./authenticators/` fits your technique:

1. Copy the template `./authenticators/0_default_authenticator_template.json`, name it after your authenticator, and place it in the `authenticators/` folder.
2. Fill out **all fields** in the template. For guidance on the expected values for each field, refer to [A FACETED CLASSIFICATION OF AUTHENTICATOR-CENTRIC AUTHENTICATION TECHNIQUES](#TODO).
3. Each authenticator must have at least one `authenticationFactor` set to one of: `Knowledge-based`, `Possession-based`, or `Biometrics-based`. Additional factors may be added, but at least one of these three is mandatory.
4. Commit your changes as part of the merge request for your technique.
