# JISHO2JSON

A simple chrome extension to copy a clicked [Jisho.org](http://jisho.org) entry as stringified JSON. 

Copies to the clipboard for easy pasting into your wordlist. I'm working on a simple conversion script to import a wordlist in this format as Anki flashcards.

Visit [chrome://extensions](chrome://extensions) and "Load Unpacked Extension" to enable. Only runs on jisho.org domain.

#### Sample output
```json
{
  "Tags": [
    "No-adjective", 
    "Adverb", 
    "Noun"
  ],
  "JA": "実際",
  "Kana": "じっさい",
  "EN": [
    "practicality; practical", 
    "reality; actuality; actual conditions", 
    "bhutakoti (limit of reality) (Buddhist term)"
  ],
  "Sentences": [
    {
      "JA": "原則として客車に駐車場がなくてはならないが実際にはあり得ない",
      "EN": "In principle, there should be a parking place for every car. In practice, this is not true."
    }, 
    {
      "JA": "きのうのことのように思えるけど私たちが初めて会ってから実際には年近くになるんですね",
      "EN": "It seems like yesterday, but it's actually nearly ten years since we first met."
    }
  ]
}

```
### Clickable target zones outlined in orange (in image only)
![targets](http://djtb.github.io/jisho2json/img/targets.png)
