// https://leetcode.com/problems/substring-with-concatenation-of-all-words/solutions/1933815/rust-solution-with-comments-and-time-space-analysis/
pub fn find_substring(s: String, words: Vec<String>) -> Vec<i32> {
	// O(s.len()) space
    let mut result = Vec::new();
    if words.len() == 0 {
        return result;
    }
    let k = words[0].len();

    if s.len() < k * words.len() {
        return result;
    }

    // substring: (current quantity, target)
    // O(words.len()) space
    let mut stat: HashMap<&str, (i32, i32)> = HashMap::with_capacity(words.len());

    // We collect current and required quatities for each word
    // O(words.len()) time
    for word in words.iter() {
        match stat.get_mut(&word[..]) {
            Some((_,quantity)) => {*quantity += 1;},
            None => {stat.insert(word, (0,1));},
        }
    }

    let mut left: usize;
    let mut right: usize;
    let mut counter;

    // Since we step by word length (which is the same for all words)
    // We can check s by offsetting window indices up to word length symbols
    // O(words[i].len()) time
    for i in 0..k {
        right = i;
        left = i;
        // We need counter as an indicator that all words are present
        counter = stat.len();
        stat.values_mut().for_each(|v| v.0 = 0);

        // We move right pointer of window up to the valid start of word
        // which is up to k symbols from the end of the string
        // O(s.len()) time
        while right < s.len() + 1 - k {
            // O(words[i].len()) space
            let current_word = &s[right..right + k as usize];
            // O(1) time
            // We are checking current word-size substring whether 
            // it is a word in our hashmap
            match stat.get_mut(current_word) {
                // If it is we update current quantity and compare it with target quantity
                Some((quantity, target)) => {
                    *quantity += 1;

                    // if we collect required quantity of the word
                    // we signal that we moved further to the match
                    if *quantity == *target {
                        counter -= 1;
                    // If we are over the needed,
                    // then we should move behind the first occurence of the current word
                    // to keep its quantity equal to target
                    } else if *quantity > *target {

                        // Moving to the first occurence of the current word
                        // requires that we update statistics of all other words on the way
                        // O(words.len()) time
                        while let Some((q, t)) = stat.get_mut(&s[left..left + k as usize]) {
                            if *q == *t {
                                counter += 1;
                            }
                            *q -= 1;

                            // Slice comparison requires
                            // O(words[i].len()) time
                            if &s[left..left + k as usize] == current_word {
                                left += k;
                                break;
                            }
                            left += k;
                        }
                    }
                },

                // Current word-size substring is not among words
                // We should reset all search stats
                // and move our left pointer behind current 
                // word-size substring to start new search
                None => {
                    counter = stat.len();
                    // O(words.len()) time
                    stat.values_mut().for_each(|v| v.0 = 0);
                    left = right + k;
                }
            }

            // If in the current iteration we have met requirements
            if counter == 0 {
                // we save the result
                result.push(left as i32);
                // And move one word to the right (it is necessary to check overlapping results)
                // O(1) time
                if let Some((q, _)) = stat.get_mut(&s[left..left + k as usize]) {
                    *q -= 1;
                    counter += 1;
                    left += k;
                }
            }
            right += k;
        }
    }
    result
}