-- Create enum types
CREATE TYPE user_tipo AS ENUM ('sindico', 'porteiro', 'morador');
CREATE TYPE status_visitante AS ENUM ('ativo', 'saiu');
CREATE TYPE status_reserva AS ENUM ('pendente', 'aprovada', 'recusada', 'cancelada');
CREATE TYPE tipo_transacao AS ENUM ('receita', 'despesa');
CREATE TYPE status_morador AS ENUM ('ativo', 'inativo');

-- Create usuarios table
CREATE TABLE public.usuarios (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    password_hash TEXT NOT NULL,
    user_tipo user_tipo NOT NULL DEFAULT 'morador',
    status status_morador NOT NULL DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blocos table
CREATE TABLE public.blocos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create apartamentos table
CREATE TABLE public.apartamentos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    numero TEXT NOT NULL,
    bloco_id UUID NOT NULL REFERENCES public.blocos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(numero, bloco_id)
);

-- Create usuario_apartamentos table (many-to-many relationship)
CREATE TABLE public.usuario_apartamentos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    apartamento_id UUID NOT NULL REFERENCES public.apartamentos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(usuario_id, apartamento_id)
);

-- Create visitantes table
CREATE TABLE public.visitantes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    documento TEXT NOT NULL,
    apartamento_id UUID NOT NULL REFERENCES public.apartamentos(id) ON DELETE CASCADE,
    data_entrada TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    data_saida TIMESTAMP WITH TIME ZONE,
    status status_visitante NOT NULL DEFAULT 'ativo',
    observacoes TEXT,
    registrado_por UUID NOT NULL REFERENCES public.usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ambientes table
CREATE TABLE public.ambientes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    capacidade INTEGER,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reservas table
CREATE TABLE public.reservas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ambiente_id UUID NOT NULL REFERENCES public.ambientes(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    status status_reserva NOT NULL DEFAULT 'pendente',
    observacoes TEXT,
    criado_por UUID NOT NULL REFERENCES public.usuarios(id),
    aprovado_por UUID REFERENCES public.usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create encomendas table (already referenced in code)
CREATE TABLE public.encomendas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    destinatario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    apartamento_id UUID NOT NULL REFERENCES public.apartamentos(id) ON DELETE CASCADE,
    loja TEXT NOT NULL,
    codigo_rastreio TEXT,
    data_recebimento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    data_entrega TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'aguardando',
    observacoes TEXT,
    registrado_por UUID NOT NULL REFERENCES public.usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comunicacoes table
CREATE TABLE public.comunicacoes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'notificacao', -- 'notificacao', 'mensagem', 'comunicado'
    remetente_id UUID NOT NULL REFERENCES public.usuarios(id),
    destinatario_id UUID REFERENCES public.usuarios(id), -- NULL for broadcast messages
    apartamento_id UUID REFERENCES public.apartamentos(id), -- for apartment-specific messages
    bloco_id UUID REFERENCES public.blocos(id), -- for block-specific messages
    is_lida BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create financeiro table
CREATE TABLE public.financeiro (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    descricao TEXT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    tipo tipo_transacao NOT NULL,
    categoria TEXT,
    data_transacao DATE NOT NULL DEFAULT CURRENT_DATE,
    observacoes TEXT,
    criado_por UUID NOT NULL REFERENCES public.usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apartamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario_apartamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encomendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunicacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financeiro ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing read for authenticated users, specific write permissions)
CREATE POLICY "Allow read access for authenticated users" ON public.usuarios FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON public.blocos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON public.apartamentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON public.usuario_apartamentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON public.visitantes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON public.ambientes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON public.reservas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON public.encomendas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON public.comunicacoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON public.financeiro FOR SELECT TO authenticated USING (true);

-- Allow inserts/updates/deletes for authenticated users (will be refined with more specific policies later)
CREATE POLICY "Allow write access for authenticated users" ON public.usuarios FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow write access for authenticated users" ON public.blocos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow write access for authenticated users" ON public.apartamentos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow write access for authenticated users" ON public.usuario_apartamentos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow write access for authenticated users" ON public.visitantes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow write access for authenticated users" ON public.ambientes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow write access for authenticated users" ON public.reservas FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow write access for authenticated users" ON public.encomendas FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow write access for authenticated users" ON public.comunicacoes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow write access for authenticated users" ON public.financeiro FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.blocos (nome, descricao) VALUES 
('Bloco A', 'Bloco residencial principal'),
('Bloco B', 'Bloco residencial secundário');

INSERT INTO public.apartamentos (numero, bloco_id) 
SELECT '10' || i, (SELECT id FROM public.blocos WHERE nome = 'Bloco A' LIMIT 1) FROM generate_series(1, 5) i
UNION ALL
SELECT '20' || i, (SELECT id FROM public.blocos WHERE nome = 'Bloco B' LIMIT 1) FROM generate_series(1, 5) i;

INSERT INTO public.ambientes (nome, descricao, capacidade) VALUES 
('Salão de Festas', 'Salão principal para eventos', 100),
('Churrasqueira', 'Área de churrasqueira', 20),
('Piscina', 'Área da piscina', 50),
('Quadra', 'Quadra esportiva', 30);

-- Insert sample users (síndico and porteiro with hashed passwords - in real app these would be properly hashed)
INSERT INTO public.usuarios (nome, email, telefone, password_hash, user_tipo) VALUES 
('Carlos Silva', 'sindico@condoway.com', '(11) 99999-9999', 'sindico123', 'sindico'),
('João Santos', 'porteiro@condoway.com', '(11) 88888-8888', 'porteiro123', 'porteiro'),
('Maria Oliveira', 'maria@email.com', '(11) 77777-7777', 'morador123', 'morador'),
('José Santos', 'jose@email.com', '(11) 66666-6666', 'morador123', 'morador');