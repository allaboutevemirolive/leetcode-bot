// https://leetcode.com/problems/regular-expression-matching/solutions/765807/two-pass-rust-solution/
use std::collections::HashMap;

#[derive(PartialEq, Eq, Hash)]
enum CharMatcher {
    Any,
    Literal(char),
}

impl CharMatcher {
    pub fn does_match(&self, ch: char) -> bool {
        match self {
            CharMatcher::Any => true,
            CharMatcher::Literal(expected) => *expected == ch,
        }
    }
}

#[derive(PartialEq, Eq, Hash)]
enum Pattern {
    ZeroOrMore(CharMatcher),
    Char(CharMatcher),
}

impl Pattern {
    pub fn can_match_zero_chars(&self) -> bool {
        match self {
            Pattern::Char(_) => false,
            Pattern::ZeroOrMore(_) => true,
        }
    }
}

fn parse_pattern(p: &str) -> Result<Vec<Pattern>, &'static str> {
    fn char_to_matcher(ch: char) -> Result<CharMatcher, &'static str> {
        match ch {
            '.' => Ok(CharMatcher::Any),
            '*' => Err("Literal * not allowed"),
            c => Ok(CharMatcher::Literal(c)),
        }
    }

    let mut patterns = vec![];
    let mut chars = p.chars();
    while let Some(ch) = chars.next() {
        let next_ch_opt = chars.as_str().chars().next();
        if let Some(_) = next_ch_opt.filter(|next_ch| *next_ch == '*') {
            // Skip the '*' char.
            chars.next().unwrap();
            patterns.push(Pattern::ZeroOrMore(char_to_matcher(ch)?));
        } else {
            patterns.push(Pattern::Char(char_to_matcher(ch)?));
        }
    }

    Ok(patterns)
}

fn _is_match<'a>(
    s: &'a str,
    patterns: &'a [Pattern],
    cache: &mut HashMap<(&'a str, &'a [Pattern]), bool>,
) -> bool {
    if s.is_empty() || patterns.is_empty() {
        return s.is_empty() && patterns.iter().all(|p| p.can_match_zero_chars());
    }
    if let Some(res) = cache.get(&(s, patterns)) {
        return *res;
    }
    let first_ch = s.chars().next().unwrap();

    let res = match &patterns[0] {
        Pattern::Char(matcher) => {
            matcher.does_match(first_ch) && _is_match(&s[1..], &patterns[1..], cache)
        }
        Pattern::ZeroOrMore(matcher) => {
            let mut chars = s.chars();
            // Check if one characters leads to a match.
            while let Some(_) = chars.next().filter(|ch| matcher.does_match(*ch)) {
                if _is_match(chars.as_str(), &patterns[1..], cache) {
                    return true;
                }
            }
            // Check if zero characters leads to a match.
            _is_match(s, &patterns[1..], cache)
        }
    };

    cache.insert((s, patterns), res);
    res
}

pub fn is_match(s: String, p: String) -> bool {
    let patterns = parse_pattern(p.as_str()).expect("pattern parsing error");
    _is_match(s.as_str(), patterns.as_slice(), &mut HashMap::new())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_regex_match() {
        assert_eq!(is_match(String::from("abc"), String::from("abc")), true);
        assert_eq!(is_match(String::from("abc"), String::from("a.c")), true);
        assert_eq!(is_match(String::from("abc"), String::from("a.d")), false);
        assert_eq!(is_match(String::from("abc"), String::from("c*a.c")), true);
        assert_eq!(is_match(String::from("a"), String::from(".*..a*")), false);
        assert_eq!(is_match(String::from("a"), String::from("")), false);
    }
}


impl Solution {
    pub fn is_match(s: String, p: String) -> bool {
        is_match(s, p)
    }
}