import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const rows = [
  {
    id: crypto.randomUUID(),
    name: 'coy',
    phone: '34984182244',
    fields: 'Nome, Contato, Mensagem',
    message: 'Olá senhor coy, se liga nas nossas promoções: google.com',
    status: 'Enviado', //Enviado or Não enviado.
  },
  {
    id: crypto.randomUUID(),
    name: 'joao',
    phone: '34984182244',
    fields: 'Nome, Contato, Mensagem',
    message: 'Olá senhor coy, se liga nas nossas promoções: google.com',
    status: 'Enviado', //Enviado or Não enviado.
  },
  {
    id: crypto.randomUUID(),
    name: 'carlos',
    phone: '34984182244',
    fields: 'Nome, Contato, Mensagem',
    message: 'Olá senhor coy, se liga nas nossas promoções: google.com',
    status: 'Enviado', //Enviado or Não enviado.
  },
  {
    id: crypto.randomUUID(),
    name: 'Sabrina',
    phone: '34984182244',
    fields: 'Nome, Contato, Mensagem',
    message: 'Olá senhor coy, se liga nas nossas promoções: google.com',
    status: 'Enviado', //Enviado or Não enviado.
  },
  {
    id: crypto.randomUUID(),
    name: 'Souza',
    phone: '34984182244',
    fields: 'Nome, Contato, Mensagem',
    message: 'Olá senhor coy, se liga nas nossas promoções: google.com',
    status: 'Enviado', //Enviado or Não enviado.
  },
];

export default function ContactsTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Contato</TableCell>
            <TableCell>Campos</TableCell>
            <TableCell>Mensagem</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.fields}</TableCell>
              <TableCell>{row.message}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
