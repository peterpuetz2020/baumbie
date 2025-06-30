<script lang="ts">
	import { DialogPanel } from '$components/overlay';
	import { Notice } from '$components/ui';
</script>

<DialogPanel title="Über BaumBie" closeable={true}>
	<img src="/icons/logo_baumbie.svg" alt="BaumBie Logo" class="mb-4 w-32 h-auto mx-auto" />
	<Notice tone = "info">
BaumBie möchte Menschen mit der Natur in Verbindung bringen. Die interaktive Karte zeigt Infos über alle Stadtbäume an, etwa Alter, Baumart oder Höhe. Die App soll dazu anregen, sich spielerisch mit der Umwelt zu beschäftigen.

Grundlage der Karte ist aktuell das Baumkataster der Stadt Bielefeld. Es sind also alle Stadtbäume zu sehen. Das Baumkataster wird vom Umweltbetrieb gepflegt, der sich auch um die Bewässerung und Pflege der Bäume kümmert. Wir stehen im engen Austausch mit dem zuständigen Team. Das Projekt ist so angelegt, dass künftig auch Privatpersonen, oder andere Organisationen Daten mit uns teilen können, damit wir ihre Bäume in der App zeigen können.

Im Chat können Nutzer:innen sich spielerisch mit jedem einzelnen Baum auseinandersetzen und ihm Fragen stellen. Der Chat basiert ebenfalls auf den echten Informationen über jeden Baum. Nutzer:innen erhalten also unterschiedliche Antworten, je nachdem, welchem Baum sie befragen.

Eine weitere wichtige Funktion der App: Die Bäume können adoptiert werden. So erfahren Nutzer:innen live, wie es ihrem Baum geht und können beim Gießen des Baums helfen. Ein Baum kann mehrere Pat:innen haben. Das soll auch Nachbarschaften zusammenbringen.

Das Projekt ist inspiriert von <a href="https://www.giessdenkiez.de/map?treeAgeMax=200&lang=de">“Gieß den Kiez”</a> aus Berlin. Es wird entwickelt von Ehrenamtlichen aus dem Verein <a href="https://codefor.de/bielefeld/">Code for Bielefeld e.V</a>. Wir sind ein gemeinnütziger Verein für digitale Bildung, Open Source, Open Data und Civic Coding. Wir setzen unsere technischen und kreativen Fähigkeiten ein, um unsere Stadt zu verbessern und sind Teil der bundesweiten Initiative <a href="https://codefor.de/">“Code for Germany”</a> von der Open Knowledge Foundation. Wir freuen uns über weitere Interessierte.
	</Notice>
</DialogPanel>
