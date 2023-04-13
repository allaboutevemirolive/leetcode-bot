// https://leetcode.com/problems/regular-expression-matching/solutions/2814379/naive-backtracking-solution-in-rust/
impl Solution {
pub fn is_match(s: String, p: String) -> bool {
    let chars_s: Vec<char> = s.chars().collect();
    let chars_p: Vec<char> = p.chars().collect();

    let tokens = tokenize(chars_p);

    match_tokens(&chars_s, &tokens, 0, 0)
}
}

enum Token {
    Repeat(char),
    One(char),
    Any,
    RepeatAny,
}


fn match_tokens(chars_s: &[char], tokens: &[Token], idx_s: usize, idx_token: usize) -> bool {
    if idx_s == chars_s.len() && idx_token == tokens.len() {
        true
    } else if idx_s == chars_s.len() {
        matches!(tokens[idx_token], Token::Repeat(_) | Token::RepeatAny)
            && match_tokens(chars_s, tokens, idx_s, idx_token + 1)
    } else if idx_token == tokens.len() {
        false
    } else {
        match (chars_s[idx_s], &tokens[idx_token]) {
            (c, Token::One(c2)) if c == *c2 => {
                match_tokens(chars_s, tokens, idx_s + 1, idx_token + 1)
            }
            (c, Token::One(c2)) => {
                false
            }
            (c, Token::Any) => {
                match_tokens(chars_s, tokens, idx_s + 1, idx_token + 1)
            }
            (c, Token::Repeat(c2)) if c == *c2 => {
                match_tokens(chars_s, tokens, idx_s, idx_token + 1)
                    || match_tokens(chars_s, tokens, idx_s + 1, idx_token + 1)
                    || match_tokens(chars_s, tokens, idx_s + 1, idx_token)
            }
            (c, Token::Repeat(c2)) => {
                match_tokens(chars_s, tokens, idx_s, idx_token + 1)
            }
            (c, Token::RepeatAny) => {
                match_tokens(chars_s, tokens, idx_s, idx_token + 1)
                    || match_tokens(chars_s, tokens, idx_s + 1, idx_token + 1)
                    || match_tokens(chars_s, tokens, idx_s + 1, idx_token)
            }
        }
    }
}
#[allow(clippy::collapsible_else_if)]
fn tokenize(chars: Vec<char>) -> Vec<Token> {
    let mut i = 0;
    let mut ret = Vec::new();

    while i < chars.len() {
        if i == chars.len() - 1 {
            if chars[i] == '.' {
                ret.push(Token::Any);
            } else {
                ret.push(Token::One(chars[i]));
            }
        } else {
            if chars[i + 1] == '*' {
                if chars[i] == '.' {
                    ret.push(Token::RepeatAny);
                } else {
                    ret.push(Token::Repeat(chars[i]));
                }
                i += 1;
            } else {
                if chars[i] == '.' {
                    ret.push(Token::Any);
                } else {
                    ret.push(Token::One(chars[i]));
                }
            }
        }
        i += 1;
    }
    ret
}
