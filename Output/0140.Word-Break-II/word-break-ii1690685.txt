// https://leetcode.com/problems/word-break-ii/solutions/1690685/rust-0ms-2mb-speed-100-mem-80/
impl Solution {
    pub fn word_break(s: String, word_dict: Vec<String>) -> Vec<String> {
        let mut trie = Trie::new();
        for w in word_dict.iter() {
            trie.insert(w.clone());
        }

        let mut res: Vec<String> = vec![];
        recursive(&s.as_str(), &"".into(), &"".into(), &mut res, &trie);

        res
    }  
}

fn recursive(s: &str, cur_word: &String, cur: &String, res: &mut Vec<String>, trie: &Trie) {
    // add cur to res
    if s.is_empty() {
        if trie.search(cur_word.into()) {
            let new_cur = &format!("{}{} ", cur, cur_word);
            res.push(new_cur.trim().into());
        }
        return;
    }
    // if we can insert space, add current word and a space to cur
    // 1. trie.search
    // 2. trie.start_with
    // 3. can not continue

    if trie.search(cur_word.into()) {
        let new_cur = &format!("{}{} ", cur, cur_word);
        let new_cur_word = &format!("{}{}", "", &s[0..1]);
        recursive(&s[1..s.len()], new_cur_word, new_cur, res, trie);
    }
	// early stop
    if !trie.starts_with(cur_word.into()) {
        return;
    }

	// we can continue with current word, 
	// add a char to it
    let new_cur_word = &format!("{}{}", cur_word, &s[0..1]);
    let new_cur = &cur.clone();
    recursive(&s[1..s.len()], new_cur_word, new_cur, res, trie);
}