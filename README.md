# JISHO2JSON

A simple chrome extension to copy a clicked [Jisho.org](http://jisho.org) entry as stringified JSON. 

Copies to the clipboard for easy pasting into your wordlist. 

Copy all these files into a folder, then visit [chrome://extensions](chrome://extensions) in the address bar of your Chrome browser. Choose "Load Unpacked Extension" and select the folder. The extension is only active on jisho.org domain.

Future plans to include a word-list formatted like this to be accepted as new vocab items for review on [Kaniwani](http://github.com/tadgh/KW).

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

#### Alternative output.
Edit the following variable in `jisho2json.js` to define the output you prefer. For example, remove Sentences, change JA to Kanji, and EN to Meanings.
```javascript
var jre = {
  Tags: tags,
  JA: ja,
  Kana: kana || null,
  EN: en,
  Sentences: sentences
};
```

### These are the clickable target zones on Jisho.org
![targets](http://djtb.github.io/jisho2json/img/targets.png)
