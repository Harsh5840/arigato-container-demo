# SakuraStatus container demonstration

This fictional Japanese storefront deliberately declares **nginx:1.26.0** in `compose.yaml`. It is an outdated demonstration inventory, and must never be deployed. The baseline container is not executed by CI.

ProofPatch can connect this repository like any other repository, discover the image reference, correlate upstream nginx advisories, propose a published patched tag pinned to its Docker registry digest, run verification on the candidate and raise a draft pull request for a human reviewer. The visible patch is a single YAML `image:` change.

The nginx vendor lists 1.26.0 in affected ranges, including [CVE-2024-7347](https://nginx.org/en/security_advisories.html). That issue depends on the MP4 module and application configuration. This static storefront does not exercise an exploit. Finding an affected version does not prove exploitation or that every image package is vulnerable. Updating nginx does not establish that all OS packages are clean; inspect the attached scanner evidence and outstanding advisories.

`npm test` checks eight baseline application contracts without installing packages or starting the old image. Candidate verification can run the frozen `tests/runtime-check.sh` against only the patched image, with its network disabled and no credentials. It checks the Japanese text, JPY catalog, health response, stylesheet, 404 behavior and response headers. The candidate uses the existing unprivileged port 8080, non-root UID, read-only filesystem, dropped capabilities and temporary writable storage.

The data, products and status service are fictional. Human review and merge do not deploy a running service; deployment and any incident investigation remain the owner's responsibility.
