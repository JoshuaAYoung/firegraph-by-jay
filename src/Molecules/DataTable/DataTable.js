import React from 'react';
import IconButton from '@mui/joy/IconButton';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

const createData = (name, calories, fat, carbs, protein, price) => {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
};

const Row = (props) => {
  const { row } = props;
  const [open, setOpen] = React.useState(props.initialOpen || false);

  return (
    <>
      <tr onClick={() => setOpen(!open)}>
        <td>
          <IconButton
            aria-label="expand row"
            variant="plain"
            color="neutral"
            size="sm"
            onClick={() => setOpen(!open)}
          >
            {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </IconButton>
        </td>
        <td>{row.name}</td>
        <td>{row.calories}</td>
        <td>{row.fat}</td>
        <td>{row.carbs}</td>
        <td>{row.protein}</td>
      </tr>
      <tr>
        <td style={{ height: 0, padding: 0 }} colSpan={6}>
          {open && (
            <Sheet
              variant="soft"
              color="neutral"
              sx={{
                p: 1,
                pl: 6,
                boxShadow: 'inset 0 3px 6px 0 rgba(0 0 0 / 0.08)',
              }}
            >
              test
            </Sheet>
          )}
        </td>
      </tr>
    </>
  );
};

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
  createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
];

const DataTable = () => {
  return (
    <Sheet
      variant="soft"
      color="neutral"
      sx={{
        pt: 1,
        borderRadius: 'sm',
        transition: '0.3s',
        '& tr:last-child': {
          '& td:first-child': {
            borderBottomLeftRadius: '8px',
          },
          '& td:last-child': {
            borderBottomRightRadius: '8px',
          },
        },
      }}
    >
      <Table
        hoverRow
        borderAxis="bothBetween"
        aria-label="collapsible table"
        // sx={{
        //   '& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)':
        //     { textAlign: 'right' },
        //   '& > tbody > tr:nth-child(odd) > td, & > tbody > tr:nth-child(odd) > th[scope="row"]':
        //     {
        //       borderBottom: 0,
        //     },
        // }}
      >
        <thead>
          <tr>
            <th style={{ width: 40 }} aria-label="empty" />
            <th style={{ width: '40%' }}>Dessert (100g serving)</th>
            <th>Calories</th>
            <th>Fat&nbsp;(g)</th>
            <th>Carbs&nbsp;(g)</th>
            <th>Protein&nbsp;(g)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <Row key={row.name} row={row} initialOpen={index === 0} />
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
};

export default DataTable;
