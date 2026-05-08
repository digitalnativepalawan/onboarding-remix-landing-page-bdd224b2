CREATE POLICY "Anyone can update feedback" ON public.feedback FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete feedback" ON public.feedback FOR DELETE USING (true);