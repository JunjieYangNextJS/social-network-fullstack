import { useState } from 'react';
import {
  createStyles,
  Header,
  Container,
  Anchor,
  Group,
  Burger,
  Image,
  Text,
  Divider,
  Table,
  Title,
  Center,
  Button,
  Stack,
  Paper,
  RingProgress,
  ActionIcon
} from '@mantine/core';
// import MainLogo from './../images/logo2';
import { useDisclosure } from '@mantine/hooks';
import { BrandInstagram, BrandTwitter, BrandYoutube } from 'tabler-icons-react';

const HEADER_HEIGHT = 84;

const useStyles = createStyles(theme => ({
  header: {
    backgroundColor: theme.colors.cyan[6],
    borderBottom: 0
  },

  inner: {
    height: HEADER_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none'
    }
  },

  links: {
    paddingTop: theme.spacing.lg,
    height: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',

    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  },

  mainLinks: {
    marginRight: -theme.spacing.sm
  },

  mainLink: {
    textTransform: 'uppercase',
    fontSize: 13,
    color: theme.white,
    padding: `7px ${theme.spacing.sm}px`,
    fontWeight: 700,
    borderBottom: '2px solid transparent',
    transition: 'border-color 100ms ease, opacity 100ms ease',
    opacity: 0.9,
    borderTopRightRadius: theme.radius.sm,
    borderTopLeftRadius: theme.radius.sm,

    '&:hover': {
      opacity: 1,
      textDecoration: 'none'
    }
  },

  secondaryLink: {
    color: theme.colors[theme.primaryColor][0],
    fontSize: theme.fontSizes.xs,
    textTransform: 'uppercase',
    transition: 'color 100ms ease',

    '&:hover': {
      color: theme.white,
      textDecoration: 'none'
    }
  },

  mainLinkActive: {
    color: theme.white,
    opacity: 1,
    borderBottomColor:
      theme.colorScheme === 'dark' ? theme.white : theme.colors.cyan[5],
    backgroundColor: theme.colors.cyan[5]
  },

  footer: {
    marginTop: 120,
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`
  },

  logo: {
    maxWidth: 200,

    [theme.fn.smallerThan('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  },

  description: {
    marginTop: 5,

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs,
      textAlign: 'center'
    }
  },

  inner2: {
    display: 'flex',
    justifyContent: 'space-between',

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
      alignItems: 'center'
    }
  },

  groups: {
    display: 'flex',
    flexWrap: 'wrap',

    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  },

  wrapper: {
    width: 160
  },

  link: {
    display: 'block',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
    fontSize: theme.fontSizes.sm,
    paddingTop: 3,
    paddingBottom: 3,

    '&:hover': {
      textDecoration: 'underline'
    }
  },

  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: theme.spacing.xs / 2,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black
  },

  afterFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column'
    }
  },

  social: {
    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs
    }
  }
}));

export default function Loan() {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(0);

  const mainLinks = [
    { link: null, label: 'Account Status' },
    { link: null, label: 'History' },
    { link: null, label: 'Track' },

    { link: null, label: 'Academic Guide' },
    { link: null, label: 'Applications' },
    { link: null, label: 'Help' }
  ];

  const userLinks = [
    { link: null, label: 'Account settings' },
    { link: null, label: 'Security&privacy' },
    { link: null, label: 'Support options' }
  ];

  const mainItems = mainLinks.map((item, index) => (
    <Anchor
      href={item.link}
      key={item.label}
      className={cx(classes.mainLink, {
        [classes.mainLinkActive]: index === active
      })}
      onClick={event => {
        event.preventDefault();
        setActive(index);
      }}
    >
      {item.label}
    </Anchor>
  ));

  const secondaryItems = userLinks.map(item => (
    <Anchor
      href={item.link}
      key={item.label}
      onClick={event => event.preventDefault()}
      className={classes.secondaryLink}
    >
      {item.label}
    </Anchor>
  ));

  const current = '$41,696';

  const data = [
    {
      transactionDate: 'Pending',
      transactionAmount: '-$20,000',
      grantedFrom: '-',
      paidFrom: 'Debt Relief',
      remainingDebt: current
    },
    {
      transactionDate: '08/22/2022',
      transactionAmount: '-$320',
      grantedFrom: '-',
      paidFrom: 'Mercedes-Benz Group',
      remainingDebt: '$41,696'
    },
    {
      transactionDate: '08/15/2022',
      transactionAmount: '-$640',
      grantedFrom: '-',
      paidFrom: 'Mercedes-Benz Group',
      remainingDebt: '$42,016'
    },
    {
      transactionDate: '08/01/2022',
      transactionAmount: '-$640',
      grantedFrom: '-',
      paidFrom: 'Mercedes-Benz Group',
      remainingDebt: '$42,656'
    },

    {
      transactionDate: '07/18/2022',
      transactionAmount: '-$640',
      grantedFrom: '-',
      paidFrom: 'Mercedes-Benz Group',
      remainingDebt: '$43,296'
    },
    {
      transactionDate: '07/05/2022',
      transactionAmount: '-$640',
      grantedFrom: '-',
      paidFrom: 'Mercedes-Benz Group',
      remainingDebt: '$43,936'
    },
    {
      transactionDate: '06/20/2022',
      transactionAmount: '-$640',
      grantedFrom: '-',
      paidFrom: 'Mercedes-Benz Group',
      remainingDebt: '$44,576'
    },
    {
      transactionDate: '06/06/2022',
      transactionAmount: '-$640',
      grantedFrom: '-',
      paidFrom: 'Mercedes-Benz Group',
      remainingDebt: '$45,216'
    },
    {
      transactionDate: '01/12/2022',
      transactionAmount: '+$23,378',
      grantedFrom: 'Direct Unsubsidized Loans',
      paidFrom: '-',
      remainingDebt: '$45,856'
    },
    {
      transactionDate: '10/27/2022',
      transactionAmount: '-$900',
      grantedFrom: '-',
      paidFrom: 'Junjie Yang',
      remainingDebt: '$22,478'
    },
    {
      transactionDate: '01/14/2021',
      transactionAmount: '+$23,378',
      grantedFrom: 'Direct Unsubsidized Loans',
      paidFrom: '-',
      remainingDebt: '$23,378'
    }
  ];

  const rows = data.map((row, i) => (
    <tr key={i}>
      <td>{row.transactionDate}</td>
      <td>{row.transactionAmount}</td>
      <td>{row.grantedFrom}</td>
      <td>{row.paidFrom}</td>
      <td>{row.remainingDebt}</td>
    </tr>
  ));

  const footerData = [
    {
      title: 'About',
      links: [
        { label: 'Grant Workshops', link: null },
        { label: 'Loan Event Awards', link: null },
        { label: 'Unsubedized Finacing', link: null }
      ]
    },
    {
      title: 'Our mission',
      links: [
        { label: 'Care Act INF', link: null },
        { label: 'Graduate publications', link: null },
        { label: 'Organizational Chart', link: null }
      ]
    },
    {
      title: 'Sites',
      links: [
        { label: 'GSI Teaching Center', link: null },
        { label: 'Tanner Lectures', link: null },
        { label: 'SMART Mentoring', link: null }
      ]
    }
  ];

  const groups = footerData.map(group => {
    const links = group.links.map((link, index) => (
      <Text
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        onClick={event => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <>
      <Header height={HEADER_HEIGHT} mb={80} className={classes.header}>
        <Container className={classes.inner}>
          <div style={{ color: '#fff' }}>
            <Group spacing="xs">
              <Image
                // src={MainLogo}
                src={'/logo192.png'}
                alt="logo"
                height={50}
                sx={{ cursor: 'pointer' }}
              />
              <Text color="white" size="xl" weight={500} underline>
                Federal Student Aid
              </Text>
            </Group>
          </div>

          <div className={classes.links}>
            <Group position="right">{secondaryItems}</Group>
            <Group spacing={0} position="right" className={classes.mainLinks}>
              {mainItems}
            </Group>
          </div>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
            color="#fff"
          />
        </Container>
      </Header>
      <Container>
        <Title order={1} sx={{ marginBottom: 15 }}>
          {' '}
          Federal Student Loans
        </Title>
        <Divider />
        <Text sx={{ margin: 15 }}>
          Disclaimer: Direct Unsubsidized Loans are available to undergraduate
          and graduate students; there is no requirement to demonstrate
          financial need. Your school determines the amount you can borrow based
          on your cost of attendance and other financial aid you receive.You are
          responsible for paying the interest on a Direct Unsubsidized Loan
          during all periods. The federal government provides grants for
          students attending college or career school. Most types of grants,
          unlike loans, are sources of financial aid that generally do not have
          to be repaid. Grants can come from the federal government, your state
          government, your college or career school, or a private or nonprofit
          organization. Do your research, apply for any grants you might be
          eligible for, and be sure to meet application deadlines!
        </Text>
        <Container
          sx={{
            width: 800,
            marginTop: 70,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Group spacing="xl">
            <RingProgress
              size={200}
              roundCaps
              thickness={16}
              label={
                <Center>
                  <Text sx={{ fontSize: 22 }}>{current}</Text>
                </Center>
              }
              sections={[{ value: 100, color: 'cyan' }]}
            />
            <Paper
              // shadow="xs"
              sx={{ padding: '20px 80px' }}
              radius="md"
              withBorder
            >
              <Title order={2} sx={{ paddingBottom: 10 }}>
                Statistics
              </Title>
              <Text sx={{ fontSize: 18, padding: '3px 0' }}>
                Name: Junjie Yang
              </Text>
              <Text sx={{ fontSize: 18, padding: '3px 0' }}>
                ID#: 2781239829
              </Text>

              <Text sx={{ fontSize: 18, padding: '3px 0' }}>
                Employment status: student
              </Text>
              <Text sx={{ fontSize: 18, padding: '3px 0' }}>
                Total owned: {current}
              </Text>
              <Button
                sx={{ fontSize: 18, marginLeft: 90 }}
                variant="subtle"
                size="xs"
              >
                Pay
              </Button>
            </Paper>
          </Group>
        </Container>
        <Text sx={{ marginTop: 100 }}>
          Direct Subsidized Loans and Direct Unsubsidized Loans are federal
          student loans offered by the U.S. Department of Education (ED) to help
          eligible students cover the cost of higher education at a four-year
          college or university, community college, or trade, career, or
          technical school. (You might see Direct Subsidized Loans and Direct
          Unsubsidized Loans referred to as Stafford Loans or Direct Stafford
          Loans, but these aren’t the official loan names.)
        </Text>
        <Table sx={{ minWidth: 700, marginTop: 100, marginBottom: 100 }}>
          <thead className={cx(classes.thead)}>
            <tr>
              <th>Transaction Date</th>
              <th>Amount</th>
              <th>Granted from</th>
              <th>Paid from</th>
              <th>Remaining Debt</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <Text sx={{ margin: 15, fontSize: 14, marginBottom: 100 }}>
          A Master's degree is an essential beginning for a long-term career in
          Electrical Engineering and in Computer Science. In short, Direct
          Unsubsidized Loans have slightly better terms to help out students
          with financial need. If you filled out the FAFSA® form, you may have
          been offered grants, work-study, and loans. Before you receive a
          Direct Loan, you must complete counseling and sign a Master Promissory
          Note (MPN). Before you receive a TEACH Grant, you must complete
          counseling and sign an Agreement to Serve or Repay (Agreement) each
          year in which you receive a TEACH Grant.
        </Text>
      </Container>
      <footer className={classes.footer}>
        <Container className={classes.inner2}>
          <div className={classes.logo}>
            <Text size="xs" color="dimmed" className={classes.description}>
              Build fully functional accessible web applications faster than
              ever
            </Text>
          </div>
          <div className={classes.groups}>{groups}</div>
        </Container>
        <Container className={classes.afterFooter}>
          <Text color="dimmed" size="sm">
            © 2020 mantine.dev. All rights reserved.
          </Text>

          <Group spacing={0} className={classes.social} position="right" noWrap>
            <ActionIcon size="lg">
              <BrandTwitter size={18} stroke={1.5} />
            </ActionIcon>
            <ActionIcon size="lg">
              <BrandYoutube size={18} stroke={1.5} />
            </ActionIcon>
            <ActionIcon size="lg">
              <BrandInstagram size={18} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Container>
      </footer>
    </>
  );
}
