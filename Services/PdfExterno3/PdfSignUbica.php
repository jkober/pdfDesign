<?php


namespace Design\DesignBundle\Services\PdfExterno3;


trait PdfSignUbica
{
    protected $sing_ubica=null;
    protected function get_sign_ubica_std() {
        if ($this->sing_ubica==null) {
            $s = new \stdClass();
            $s->setea = false;
            $s->page = null;
            $s->sing_margin_top=null;
            $s->x1 = null;
            $s->y1 = null;
            $s->x2 = null;
            $s->y2 = null;
            $s->font_name = null;
            $s->font_style= null;
            $s->font_size = null;
            $this->sing_ubica=$s;
        }
        return $this->sing_ubica;
    }
    public function get_sign_ubica() {
        return $this->get_sign_ubica_std();
    }
    public function set_sign_ubica($page,$x1,$y1,$x2,$y2,$font,$style,$size,$sing_margin_top=0) {
        $s = $this->get_sign_ubica_std();
        $s->setea=false;
        $s->page=$page;
        $s->sing_margin_top=$sing_margin_top;
        $s->x1= $x1;
        $ii = 1;
        if ($this->CurOrientation =="L") {
            $ii = 0;
        }
        $s->y1= $this->DefPageSize[$ii] - $y1 + $sing_margin_top;
        $s->x2= $x2;
        $s->y2= $this->DefPageSize[$ii] - $y2 ;
        $s->font_name=$font;
        $s->font_style=$style;
        $s->font_size=$size;
    }

}