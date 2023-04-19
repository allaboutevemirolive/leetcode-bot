// https://leetcode.com/problems/basic-calculator/solutions/2378175/rust-0ms-with-expression-grammar-zero-allocation-method/
impl Solution {
    pub fn calculate(s: String) -> i32 {
        calculate(s)
    }
}

use std::iter::Peekable;

#[derive(Debug, PartialEq, Eq)]
enum Token {
    Addition,
    Subtraction,
    OpenParentheses,
    ClosingParentheses,
    Number(i32),
}

struct TokenStream {
    st: Peekable<std::vec::IntoIter<u8>>,
}

fn into_token_stream(s: String) -> TokenStream {
    TokenStream {
        st: s.into_bytes().into_iter().peekable(),
    }
}

impl TokenStream {
    fn parse_number(&mut self) -> i32 {
        let mut val: i32 = 0;
        while let Some(&ch) = self.st.peek() {
            if ch >= b'0' && ch <= b'9' {
                let digit = ch - b'0';
                val = (val * 10) + (digit as i32);
                self.st.next();
            } else {
                break;
            }
        }
        val
    }
}

impl Iterator for TokenStream {
    type Item = Token;

    fn next(&mut self) -> Option<Self::Item> {
        while let Some(&first) = self.st.peek() {
            let token;
            match first {
                b'+' => token = Some(Token::Addition),
                b'-' => token = Some(Token::Subtraction),
                b'(' => token = Some(Token::OpenParentheses),
                b')' => token = Some(Token::ClosingParentheses),
                b'0'..=b'9' => {
                    token = Some(Token::Number(self.parse_number()));
                    return token;
                }
                b' ' => {
                    // If we encounter space, then we ignore
                    // it and try to get the next token. But,
                    // the space between numbers is not acceptable
                    // and it is taken care of by parse_number.
                    self.st.next();
                    continue;
                }
                _ => token = None,
            };
            self.st.next();
            return token;
        }
        return None;
    }
}

#[derive(Debug)]
struct ParseError {
    tok: Option<Token>,
    msg: String,
}

struct Parser {
    st: Peekable<TokenStream>,
}

impl Parser {
    // parse implements the standard expression grammar and returns the result
    // Expr -> Term Expr1
    // Expr1 -> + Term Expr1
    //        | - Term Expr1
    //        | <empty>
    // Term -> Factor | -Factor
    // Factor -> (Expr) | Number
    fn parse(&mut self) -> Result<i32, ParseError> {
        self.parse_expr()
    }

    fn parse_expr(&mut self) -> Result<i32, ParseError> {
        let term = self.parse_term()?;
        let expr1_val = self.parse_expr1()?;
        Ok(term + expr1_val)
    }

    fn parse_expr1(&mut self) -> Result<i32, ParseError> {
        let operator = self.st.peek();
        match operator {
            Some(&Token::Addition) => {
                self.st.next();
                let term = self.parse_term()?;
                let expr1 = self.parse_expr1()?;
                Ok(term + expr1)
            }
            Some(&Token::Subtraction) => {
                self.st.next();
                let term = self.parse_term()?;
                let expr1 = self.parse_expr1()?;
                Ok(-term + expr1)
            }
            _ => Ok(0),
        }
    }

    fn parse_term(&mut self) -> Result<i32, ParseError> {
        let tok = self.st.peek();
        match tok {
            Some(&Token::Subtraction) => {
                self.st.next();
                Ok(-self.parse_factor()?)
            }
            Some(_) => self.parse_factor(),
            None => Err(ParseError {
                tok: None,
                msg: format!("expected token for term"),
            }),
        }
    }

    fn parse_factor(&mut self) -> Result<i32, ParseError> {
        let tok = self.st.next();
        match tok {
            Some(Token::Number(n)) => Ok(n),
            Some(Token::OpenParentheses) => {
                let subexpr = self.parse_expr();
                let next_tok = self.st.next();
                if next_tok != Some(Token::ClosingParentheses) {
                    Err(ParseError {
                        tok: next_tok,
                        msg: format!("expected )"),
                    })
                } else {
                    subexpr
                }
            }
            Some(tok) => Err(ParseError {
                tok: Some(tok),
                msg: format!("unexpected token"),
            }),
            None => Err(ParseError {
                tok: None,
                msg: format!("expected token, but got nothing"),
            }),
        }
    }
}

fn calculate(s: String) -> i32 {
    let tok_stream = into_token_stream(s);
    Parser {
        st: tok_stream.into_iter().peekable(),
    }
    .parse()
    .expect("expression should have been valid")
}