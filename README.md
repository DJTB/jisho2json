# JISHO2JSON

A simple chrome extension to copy a clicked [Jisho.org](http://jisho.org) entry as stringified JSON. 

Copy all these files into a folder, then visit [chrome://extensions](chrome://extensions) in the address bar of your Chrome browser. Choose "Load Unpacked Extension" and select the folder. The extension is only active on jisho.org domain.

Future plans to expose an endpoint for wordlists in this format (or single entries) to be accepted as new vocab items for review on [Kaniwani](https://github.com/Kaniwani/KW-Frontend).

#### Sample output for jissai entry containing 3 main definitions
```json
{
  "common": true,
  "jlpt": "JLPT N3",
  "ja": {
    "characters": "実際",
    "readings": "じっさい"
  },
  "en": [
    {
      "meanings": [
        "practicality",
        "practical"
      ],
      "notes": [],
      "tags": [
        "No-adjective",
        "Adverb",
        "Noun"
      ],
      "sentences": [
        {
          "ja": "原則として客車に駐車場がなくてはならないが実際にはあり得ない",
          "en": "In principle, there should be a parking place for every car. In practice, this is not true."
        }
      ]
    },
    {
      "meanings": [
        "reality",
        "actuality",
        "actual conditions"
      ],
      "notes": [],
      "tags": [],
      "sentences": [
        {
          "ja": "きのうのことのように思えるけど私たちが初めて会ってから実際には年近くになるんですね",
          "en": "It seems like yesterday, but it's actually nearly ten years since we first met."
        }
      ]
    },
    {
      "meanings": [
        "bhutakoti (limit of reality)"
      ],
      "notes": [
        "Buddhist term"
      ],
      "tags": [],
      "sentences": []
    }
  ]
}
```

### These are the clickable target zones on Jisho.org
![targets](http://djtb.github.io/jisho2json/img/targets.png)
