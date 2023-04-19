// https://leetcode.com/problems/basic-calculator/solutions/776145/clean-rust-code-for-any-calculator-question/
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
enum Operator {
    Add,
    Sub,
    Div,
    Mul,
}

impl Operator {
    pub fn binding_power(&self) -> u8 {
        match self {
            Operator::Add => 11,
            Operator::Sub => 11,
            Operator::Div => 12,
            Operator::Mul => 12,
        }
    }
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
enum Token {
    LParen,
    RParen,
    Int(u32),
    Op(Operator),
}

impl Token {
    pub fn get_int(&self) -> Option<u32> {
        if let Token::Int(i) = self {
            Some(*i)
        } else {
            None
        }
    }

    pub fn get_op(&self) -> Option<Operator> {
        if let Token::Op(i) = self {
            Some(*i)
        } else {
            None
        }
    }
}

fn tokenize(s: String) -> Result<Vec<Token>, String> {
    let mut chars = s.chars();
    let mut tokens = vec![];
    while let Some(c) = chars.next() {
        let token = match c {
            '(' => Token::LParen,
            ')' => Token::RParen,
            '+' => Token::Op(Operator::Add),
            '-' => Token::Op(Operator::Sub),
            '/' => Token::Op(Operator::Div),
            '*' => Token::Op(Operator::Mul),
            c if c.is_ascii_digit() => {
                let mut num = c.to_digit(10).unwrap();
                // `chars.next()` is not directly used as we don't want to read past a non-digit character.
                while let Some(c) = chars.as_str().chars().next().and_then(|c| c.to_digit(10)) {
                    num = 10 * num + c;
                    // Safe unwrap because next() returned Some() above.
                    chars.next().unwrap();
                }
                Token::Int(num)
            }
            ' ' | '\n' | '\t' => continue,
            _ => return Err(format!("Could not tokenize {:?}", c)),
        };
        tokens.push(token);
    }
    Ok(tokens)
}

enum Expr {
    Value(u32),
    BinOp(Box<Expr>, Operator, Box<Expr>),
}

impl Expr {
    pub fn eval(&self) -> Option<i32> {
        match self {
            Expr::Value(val) => Some(*val as i32),
            Expr::BinOp(left, op, right) => {
                let left_val = left.eval()?;
                let right_val = right.eval()?;
                match op {
                    Operator::Add => left_val.checked_add(right_val),
                    Operator::Sub => left_val.checked_sub(right_val),
                    Operator::Div => left_val.checked_div(right_val),
                    Operator::Mul => left_val.checked_mul(right_val),
                }
            }
        }
    }
}

struct Parser {
    tokens: Vec<Token>,
    i: usize,
}

impl Parser {
    // Parses a possibly parenthesized term.
    fn parse_term(&mut self) -> Option<Expr> {
        if let Some(value) = self.tokens.get(self.i).and_then(|t| t.get_int()) {
            self.i += 1;
            return Some(Expr::Value(value));
        }

        // Otherwise, this must be a parenthesized expression.
        self.tokens.get(self.i).filter(|t| **t == Token::LParen)?;
        self.i += 1;

        // Get the left term, and pass it to the pratt parse function.
        let left = self.parse_term()?;
        let parsed = self.pratt_parse(left, 0)?;

        self.tokens.get(self.i).filter(|t| **t == Token::RParen)?;
        self.i += 1;

        Some(parsed)
    }

    // Parses the next token as an integer value.
    fn pratt_parse(&mut self, mut left: Expr, prev_bp: u8) -> Option<Expr> {
        while let Some(op) = self
            .tokens
            .get(self.i)
            .and_then(|t| t.get_op())
            .filter(|op| op.binding_power() > prev_bp)
        {
            self.i += 1;
            let next_term = self.parse_term()?;
            let right = self.pratt_parse(next_term, op.binding_power())?;
            left = Expr::BinOp(Box::new(left), op, Box::new(right));
        }
        Some(left)
    }

    fn parse(&mut self) -> Result<Expr, String> {
        // We must have at least one value in `self.tokens` to parse.
        let left = self.parse_term().ok_or("could not parse left term")?;
        let parsed = self.pratt_parse(left, 0).ok_or("could not pratt parse")?;
        if self.i >= self.tokens.len() {
            Ok(parsed)
        } else {
            Err(format!("Not finished parsing {:?} {:?}", self.i, self.tokens).into())
        }
    }
}

pub fn calculate(s: String) -> i32 {
    let expr = Parser {
        i: 0,
        tokens: tokenize(s).expect("tokenizing failed"),
    }
    .parse()
    .expect("parsing failed");
    expr.eval().expect("cannot evaluate this...") as i32
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_calculate_add() {
        assert_eq!(calculate("0".to_string()), 0);
        assert_eq!(calculate("2+1".to_string()), 3);
        assert_eq!(calculate("2+3+5".to_string()), 10);
        assert_eq!(calculate("2+((3)+(5))".to_string()), 10);
    }

    #[test]
    fn test_calculate_paren() {
        assert_eq!(calculate("1 - 5 - 10".to_string()), -14);
        assert_eq!(calculate("1 - 5 - 10*3".to_string()), -34);
        assert_eq!(calculate("2-1 + 2".to_string()), 3);
    }

    #[test]
    fn test_calculate_complex() {
        assert_eq!(calculate("(1+(4+5+2)-3)+(6+8)".to_string()), 23);
        assert_eq!(calculate(" 3+5 / 2 ".to_string()), 5);
        assert_eq!(calculate(" 3/2 ".to_string()), 1);
    }
}
