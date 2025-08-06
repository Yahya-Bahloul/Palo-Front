// src/app/admin/upload-question/page.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { theme } from "@/styles/theme";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const categories = [
  "cinéma",
  "géographie",
  "football",
  "histoire",
  "svt",
  "ww1",
  "ww2",
];
const languages = ["fr", "en", "ar"] as const;

type TranslationInputs = {
  question: string;
  correct: string;
  wrong1: string;
  wrong2: string;
  wrong3: string;
};

export default function UploadQuestionPage() {
  const [translations, setTranslations] = useState<
    Record<string, TranslationInputs>
  >({
    fr: { question: "", correct: "", wrong1: "", wrong2: "", wrong3: "" },
    en: { question: "", correct: "", wrong1: "", wrong2: "", wrong3: "" },
    ar: { question: "", correct: "", wrong1: "", wrong2: "", wrong3: "" },
  });
  const [category, setCategory] = useState("cinéma");
  const [file, setFile] = useState<File | null>(null);
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fillFromJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      for (const lang of languages) {
        const entry = parsed[lang];
        if (
          !entry ||
          !entry.question ||
          !entry.correct ||
          !Array.isArray(entry.wrongAnswers) ||
          entry.wrongAnswers.length !== 3
        ) {
          alert(`Entrée JSON invalide pour la langue : ${lang}`);
          return;
        }
      }

      setTranslations({
        fr: {
          question: parsed.fr.question,
          correct: parsed.fr.correct,
          wrong1: parsed.fr.wrongAnswers[0],
          wrong2: parsed.fr.wrongAnswers[1],
          wrong3: parsed.fr.wrongAnswers[2],
        },
        en: {
          question: parsed.en.question,
          correct: parsed.en.correct,
          wrong1: parsed.en.wrongAnswers[0],
          wrong2: parsed.en.wrongAnswers[1],
          wrong3: parsed.en.wrongAnswers[2],
        },
        ar: {
          question: parsed.ar.question,
          correct: parsed.ar.correct,
          wrong1: parsed.ar.wrongAnswers[0],
          wrong2: parsed.ar.wrongAnswers[1],
          wrong3: parsed.ar.wrongAnswers[2],
        },
      });

      if (parsed.category) {
        setCategory(parsed.category);
      }
    } catch {
      alert("Erreur de parsing JSON.");
    }
  };

  const handleSubmit = async () => {
    for (const lang of languages) {
      const t = translations[lang];
      if (!t.question || !t.correct || !t.wrong1 || !t.wrong2 || !t.wrong3) {
        alert(`Tous les champs sont requis pour la langue : ${lang}`);
        return;
      }
    }

    const formData = new FormData();
    formData.append("category", category);
    if (file) {
      formData.append("image", file);
    }
    const translationsPayload = {
      fr: {
        question: translations.fr.question,
        correct: translations.fr.correct,
        wrongAnswers: [
          translations.fr.wrong1,
          translations.fr.wrong2,
          translations.fr.wrong3,
        ],
      },
      en: {
        question: translations.en.question,
        correct: translations.en.correct,
        wrongAnswers: [
          translations.en.wrong1,
          translations.en.wrong2,
          translations.en.wrong3,
        ],
      },
      ar: {
        question: translations.ar.question,
        correct: translations.ar.correct,
        wrongAnswers: [
          translations.ar.wrong1,
          translations.ar.wrong2,
          translations.ar.wrong3,
        ],
      },
    };

    formData.append(
      "translations",
      JSON.stringify(translationsPayload) as string
    );

    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/upload-question`, {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      alert("Question ajoutée !");
      setTranslations({
        fr: { question: "", correct: "", wrong1: "", wrong2: "", wrong3: "" },
        en: { question: "", correct: "", wrong1: "", wrong2: "", wrong3: "" },
        ar: { question: "", correct: "", wrong1: "", wrong2: "", wrong3: "" },
      });
      setCategory("cinéma");
      setFile(null);
      setJsonInput("");
      router.refresh();
    } else {
      alert("Erreur lors de l'ajout.");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 w-full">
      <div
        className={`bg-[#faedcd] border border-border shadow-xl rounded-3xl overflow-hidden py-0" p-6 space-y-6 rounded-3xl`}
      >
        <h1 className="text-3xl font-bold text-black text-center">
          Ajouter une question multilingue
        </h1>

        {/* JSON Input */}
        <div className="space-y-2">
          <Label className={theme.text.label}>Coller un JSON (optionnel)</Label>
          <textarea
            rows={5}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={""}
            className={`${theme.input.base} font-mono`}
          />
          <Button
            type="button"
            variant="secondary"
            className={`${theme.button.secondary} w-full`}
            onClick={fillFromJson}
          >
            Remplir à partir du JSON
          </Button>
        </div>

        {/* Lang-specific inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {languages.map((lang) => (
            <div key={lang} className="space-y-4">
              <h2 className="text-lg font-semibold text-black uppercase">
                {lang}
              </h2>
              <div>
                <Label className={theme.text.label}>Question</Label>
                <textarea
                  value={translations[lang].question}
                  onChange={(e) =>
                    setTranslations((prev) => ({
                      ...prev,
                      [lang]: { ...prev[lang], question: e.target.value },
                    }))
                  }
                  className={`${theme.input.base} min-h-[80px]`}
                />
              </div>

              <div>
                <Label className={theme.text.label}>Bonne réponse</Label>
                <Input
                  value={translations[lang].correct}
                  onChange={(e) =>
                    setTranslations((prev) => ({
                      ...prev,
                      [lang]: { ...prev[lang], correct: e.target.value },
                    }))
                  }
                  className={theme.input.base}
                />
              </div>

              <div>
                <Label className={theme.text.label}>Mauvaises réponses</Label>
                <div className="space-y-2">
                  {["wrong1", "wrong2", "wrong3"].map((key) => (
                    <Input
                      key={key}
                      value={translations[lang][key as keyof TranslationInputs]}
                      onChange={(e) =>
                        setTranslations((prev) => ({
                          ...prev,
                          [lang]: { ...prev[lang], [key]: e.target.value },
                        }))
                      }
                      className={theme.input.base}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Category + Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className={theme.text.label}>Catégorie</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={theme.input.base}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className={theme.text.label}>Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className={theme.input.base}
            />
            {file && (
              <Image
                src={URL.createObjectURL(file)}
                alt="Aperçu"
                width={600}
                height={240}
                className="w-full max-h-60 object-contain rounded-xl border mt-2"
              />
            )}
          </div>
        </div>

        <Button
          className={`${theme.button.primary} ${theme.button.base} w-full mb-4`}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Envoi en cours..." : "Créer la question"}
        </Button>
      </div>
    </div>
  );
}
